import { DVDChallenge, DeFiVulnSample } from './types'

export const dvdChallenges: DVDChallenge[] = [
    {
        id: 'unstoppable',
        title: 'Unstoppable',
        subtitle: 'Flash Loan Denial of Service',
        category: 'Flash Loans',
        difficulty: 'intermediate',
        scenario: "There's a tokenized vault with a million DVT tokens deposited. It’s offering flash loans for free, until the grace period ends.\n\nTo catch any bugs before going 100% permissionless, the developers decided to run a live beta in testnet. There's a monitoring contract to check liveness of the flashloan feature.\n\nStarting with 10 DVT tokens in balance, show that it's possible to halt the vault. It must stop offering flash loans.",
        objective: "Halt the vault's flash loan service and trigger the monitoring contract to pause the vault.",
        rules: [
            "You must use the player account.",
            "You must not modify the challenges initial nor final conditions.",
            "Check successful if the vault is paused."
        ],
        contracts: [
            {
                name: 'UnstoppableVault.sol',
                path: 'src/unstoppable/UnstoppableVault.sol',
                code: `// SPDX-License-Identifier: MIT
pragma solidity =0.8.25;

import {ReentrancyGuard} from "solady/utils/ReentrancyGuard.sol";
import {FixedPointMathLib} from "solady/utils/FixedPointMathLib.sol";
import {Owned} from "solmate/auth/Owned.sol";
import {SafeTransferLib, ERC4626, ERC20} from "solmate/tokens/ERC4626.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IERC3156FlashBorrower, IERC3156FlashLender} from "@openzeppelin/contracts/interfaces/IERC3156.sol";

contract UnstoppableVault is IERC3156FlashLender, ReentrancyGuard, Owned, ERC4626, Pausable {
    using SafeTransferLib for ERC20;
    using FixedPointMathLib for uint256;

    uint256 public constant FEE_FACTOR = 0.05 ether;
    uint64 public constant GRACE_PERIOD = 30 days;
    uint64 public immutable end = uint64(block.timestamp) + GRACE_PERIOD;
    address public feeRecipient;

    error InvalidAmount(uint256 amount);
    error InvalidBalance();
    error CallbackFailed();
    error UnsupportedCurrency();

    constructor(ERC20 _token, address _owner, address _feeRecipient)
        ERC4626(_token, "Too Damn Valuable Token", "tDVT")
        Owned(_owner)
    {
        feeRecipient = _feeRecipient;
    }

    function totalAssets() public view override nonReadReentrant returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function flashLoan(IERC3156FlashBorrower receiver, address _token, uint256 amount, bytes calldata data)
        external
        returns (bool)
    {
        if (amount == 0) revert InvalidAmount(0);
        if (address(asset) != _token) revert UnsupportedCurrency();
        uint256 balanceBefore = totalAssets();
        if (convertToShares(totalSupply) != balanceBefore) revert InvalidBalance();

        ERC20(_token).safeTransfer(address(receiver), amount);

        uint256 fee = flashFee(_token, amount);
        if (
            receiver.onFlashLoan(msg.sender, address(asset), amount, fee, data)
                != keccak256("IERC3156FlashBorrower.onFlashLoan")
        ) {
            revert CallbackFailed();
        }

        ERC20(_token).safeTransferFrom(address(receiver), address(this), amount + fee);
        ERC20(_token).safeTransfer(feeRecipient, fee);

        return true;
    }

    function setPause(bool flag) external onlyOwner {
        if (flag) _pause();
        else _unpause();
    }
}`
            },
            {
                name: 'UnstoppableMonitor.sol',
                path: 'src/unstoppable/UnstoppableMonitor.sol',
                code: `// SPDX-License-Identifier: MIT
pragma solidity =0.8.25;

import {IERC3156FlashBorrower} from "@openzeppelin/contracts/interfaces/IERC3156FlashBorrower.sol";
import {Owned} from "solmate/auth/Owned.sol";
import {UnstoppableVault, ERC20} from "../unstoppable/UnstoppableVault.sol";

contract UnstoppableMonitor is Owned, IERC3156FlashBorrower {
    UnstoppableVault private immutable vault;

    constructor(address _vault) Owned(msg.sender) {
        vault = UnstoppableVault(_vault);
    }

    function onFlashLoan(address initiator, address token, uint256 amount, uint256 fee, bytes calldata)
        external
        returns (bytes32)
    {
        return keccak256("IERC3156FlashBorrower.onFlashLoan");
    }

    function checkFlashLoan(uint256 amount) external onlyOwner {
        address asset = address(vault.asset());
        try vault.flashLoan(this, asset, amount, bytes("")) {
            // Success
        } catch {
            vault.setPause(true);
            vault.transferOwnership(owner);
        }
    }
}`
            }
        ],
        testCode: `function test_unstoppable() public checkSolvedByPlayer {
    /** CODE YOUR SOLUTION HERE */
}`,
        exploitHint: "The vault uses ERC4626 which tracks internal balances. What happens if the physical balance of the token doesn't match the internal bookkeeping?"
    },
    {
        id: 'naive-receiver',
        title: 'Naive Receiver',
        subtitle: 'Expensive Flash Loan Callback',
        category: 'Flash Loans',
        difficulty: 'intermediate',
        scenario: "There's a pool with 1000 WETH in balance, offering flash loans. It's also got a receiver contract with 10 WETH in balance.\n\nThe receiver contract is designed to receive flash loans and do something with them. However, it doesn't check who's initiated the flash loan.\n\nYour goal is to drain the receiver contract's balance.",
        objective: "Drain all 10 WETH from the receiver contract in a single transaction.",
        rules: [
            "You must use the player account.",
            "Check successful if the receiver contract's balance is 0."
        ],
        contracts: [
            {
                name: 'NaiveReceiverPool.sol',
                path: 'src/naive-receiver/NaiveReceiverPool.sol',
                code: `// SPDX-License-Identifier: MIT
pragma solidity =0.8.25;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";
import {IERC3156FlashLender, IERC3156FlashBorrower} from "@openzeppelin/contracts/interfaces/IERC3156.sol";

contract NaiveReceiverPool is ReentrancyGuard, IERC3156FlashLender {
    using SafeTransferLib for address;

    address public constant ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    uint256 private constant FIXED_FEE = 1 ether; // Huge fee!

    function flashFee(address token, uint256) public pure returns (uint256) {
        if (token != ETH) revert UnsupportedCurrency();
        return FIXED_FEE;
    }

    function flashLoan(IERC3156FlashBorrower receiver, address token, uint256 amount, bytes calldata data)
        external
        nonReentrant
        returns (bool)
    {
        uint256 balanceBefore = address(this).balance;
        if (token != ETH) revert UnsupportedCurrency();

        token.safeTransferETH(address(receiver), amount);

        if (receiver.onFlashLoan(msg.sender, token, amount, FIXED_FEE, data) != keccak256("IERC3156FlashBorrower.onFlashLoan")) {
            revert CallbackFailed();
        }

        if (address(this).balance < balanceBefore + FIXED_FEE) {
            revert RepayFailed();
        }

        return true;
    }

    error UnsupportedCurrency();
    error CallbackFailed();
    error RepayFailed();
}`
            },
            {
                name: 'FlashLoanReceiver.sol',
                path: 'src/naive-receiver/FlashLoanReceiver.sol',
                code: `// SPDX-License-Identifier: MIT
pragma solidity =0.8.25;

import {IERC3156FlashBorrower} from "@openzeppelin/contracts/interfaces/IERC3156.sol";

contract FlashLoanReceiver is IERC3156FlashBorrower {
    address private immutable pool;

    constructor(address _pool) {
        pool = _pool;
    }

    function onFlashLoan(address, address token, uint256 amount, uint256 fee, bytes calldata)
        external
        returns (bytes32)
    {
        if (msg.sender != pool) revert InvalidCaller();
        
        uint256 amountToBeRepaid = amount + fee;
        if (address(this).balance < amountToBeRepaid) revert InsufficientBalance();

        _executeActionDuringFlashLoan();

        payable(pool).transfer(amountToBeRepaid);

        return keccak256("IERC3156FlashBorrower.onFlashLoan");
    }

    function _executeActionDuringFlashLoan() internal {}

    error InvalidCaller();
    error InsufficientBalance();

    receive() external payable {}
}`
            }
        ],
        testCode: `function test_naive_receiver() public checkSolvedByPlayer {
    /** CODE YOUR SOLUTION HERE */
}`,
        exploitHint: "The receiver contract doesn't validate who initiated the flash loan. Can you call flashLoan on the pool and specify the receiver as the target multiple times?"
    },
    {
        id: 'truster',
        title: 'Truster',
        subtitle: 'Arbitrary Call via Flash Loan',
        category: 'Flash Loans',
        difficulty: 'intermediate',
        scenario: "More and more lendng pools are popping up. This one is offering free flash loans of a very popular token.\n\nIt has 1 million DVT tokens in balance. Can you take all of them?",
        objective: "Drain all 1 million DVT tokens from the pool.",
        rules: [
            "You must use the player account.",
            "Check successful if the pool's balance is 0."
        ],
        contracts: [
            {
                name: 'TrusterLenderPool.sol',
                path: 'src/truster/TrusterLenderPool.sol',
                code: `// SPDX-License-Identifier: MIT
pragma solidity =0.8.25;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";

contract TrusterLenderPool is ReentrancyGuard {
    using Address for address;

    ERC20 public immutable token;

    error RepayFailed();

    constructor(ERC20 _token) {
        token = _token;
    }

    function flashLoan(uint256 amount, address borrower, address target, bytes calldata data)
        external
        nonReentrant
        returns (bool)
    {
        uint256 balanceBefore = token.balanceOf(address(this));

        token.transfer(borrower, amount);
        target.functionCall(data);

        if (token.balanceOf(address(this)) < balanceBefore) {
            revert RepayFailed();
        }

        return true;
    }
}`
            }
        ],
        testCode: `function test_truster() public checkSolvedByPlayer {
    /** CODE YOUR SOLUTION HERE */
}`,
        exploitHint: "The pool executes an arbitrary call to a target address with provided data. Can you use this to approve yourself to spend the pool's tokens?"
    }
]

export const defiVulnSamples: DeFiVulnSample[] = [
    {
        id: 'reentrancy',
        title: 'Reentrancy',
        category: 'Logic',
        description: 'A classic reentrancy vulnerability where external calls are made before updating internal state.',
        code: `function withdraw(uint _amount) public {
    require(balances[msg.sender] >= _amount);
    (bool sent, ) = msg.sender.call{value: _amount}("");
    require(sent, "Failed to send Ether");
    balances[msg.sender] -= _amount;
}`,
        mitigation: 'Use the Checks-Effects-Interactions pattern or a ReentrancyGuard.',
        sourceUrl: 'https://github.com/DeiVult/DeFiVulnLabs'
    }
]

export function getDVDChallengeBySlug(slug: string): DVDChallenge | undefined {
    return dvdChallenges.find(c => c.id === slug)
}

export function getAllDVDChallenges(): DVDChallenge[] {
    return dvdChallenges
}

export function getAllDeFiVulnSamples(): DeFiVulnSample[] {
    return defiVulnSamples
}
