pragma solidity ^0.8.11;

import "./PoiToken.sol";

contract Exchange {
	address public feeAccount; //account to receive exchange fees
	uint256 public feePercent; // fee percentage

	address constant ETHER = address(0); // Placeholder ether address
	mapping(address => mapping(address => uint256)) public tokens;

	event Deposit(address token, address user, uint256 amount, uint256 balance);
	event Withdraw(address token, address user, uint256 amount, uint256 balance);


	constructor(address _feeAccount, uint256 _feePercent) {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}

	// Fallback function to revert ether sent to this smart contract by mistake
	fallback() external{
		revert();
	}
	function depositEther() public payable{
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender] + msg.value;
		emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
	}

	function withdrawEther(uint _amount) public{
		require(tokens[ETHER][msg.sender] >= _amount);
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender] - _amount;
		payable(msg.sender).transfer(_amount);
		emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
	}

	function depositToken(address _token, uint _amount) public {
		require(_token != ETHER);
		require(PoiToken(_token).transferFrom(msg.sender, address(this), _amount));
		tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;

		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function withdrawToken(address _token, uint _amount) public {
		require(_token != ETHER);
		require(tokens[_token][msg.sender] >= _amount);

		tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
		require(PoiToken(_token).transfer(msg.sender, _amount));
		emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function balanceOf (address _token, address _user) public view returns (uint256){
		return tokens[_token][_user];
	}





}