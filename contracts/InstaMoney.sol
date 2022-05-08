//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract InstaMoney is ERC20 {

    address public admin;
    uint public user_id_counter;
    uint public loan_id_counter;
    uint private late_fine;

    struct  User {
        uint id;
        string name;
        string identification;
        uint credit_score;
        bool signed_collateral_agreement;
    }

    struct Loan {
        uint id;
        uint amount;
        uint repaid_amt;
        uint term;      //months
        uint rate;
        address lender;
        address borrower;
        uint status;    // 1 = Active, 2 = PaidOff , 3 = Open offer
        uint activated_at;      //timestamp
    }

    mapping(address => User) public users;
    mapping(address => uint) private balances;
    Loan[] private loans;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Can only be executed by admin");
        _;
    }

    function getUserDetails(address addr) public view returns (User memory){
        return users[addr];
    }


    function getLateFine() public view returns(uint){
        return late_fine;
    }

    function getAllLoans() public view returns (Loan[] memory){
        return loans;
    }

    function changeLateFine(uint new_late_fee) public onlyAdmin {
        late_fine = new_late_fee;
    }

    function payOffLoan(uint loan_id, uint numTokens) public {
        require(numTokens != 0, "Zero amount is not acceptable as repayment");

        (uint at_index, bool found) = find_offer(loan_id);

        require(found, "Loan not found");
        //We are assuming anyone can pay off the loan on behalf of the borrower.
        //Even the lender or government can pay off if they are willing to forgive the loan
        require(loans[at_index].status == 1, "Loan is not active");

        uint to_repay = calculateRepaymentAmount(loan_id);

        require(numTokens <= to_repay , "Please don't transfer extra amount");

        //accept payment
        loans[at_index].repaid_amt += numTokens;
        if(numTokens == to_repay) {
            loans[at_index].status = 2;    //Paid off completely
        }
        // payable(loans[at_index].lender).transfer(numTokens);
        transfer(loans[at_index].lender,numTokens);
    }

    function calculateRepaymentAmount(uint loan_id) public view returns(uint) {

        (uint at_index, bool found) = find_offer(loan_id);
        if(!found) return 0;

        if(loans[at_index].status != 1) return 0;      //is not an active loan

        uint principal = loans[at_index].amount;

        uint time_elapsed_in_minutes = (block.timestamp - loans[at_index].activated_at) / 60;
        uint interest = calcInterest(loans[at_index].amount, loans[at_index].rate, time_elapsed_in_minutes);

        uint late_amt = 0;
        if(block.timestamp - (loans[at_index].term * 30 days) > loans[at_index].activated_at) {
            //Repayment is late
            late_amt = late_fine;
        }
        return principal + interest + late_amt - loans[at_index].repaid_amt;
    }

    function calcInterest(uint amount, uint rate, uint no_of_minutes) private pure returns(uint) {
        return amount * rate * no_of_minutes / 100 / 365 / 60 / 24;
    }

//aamir register
    function borrowReg(string memory borrower_name, string memory identification, uint credit_score, bool signed_collateral_agreement) public payable {

          if (users[msg.sender].id == 0) {
            User memory user = User({id: user_id_counter++, name: borrower_name, identification: identification , credit_score:credit_score , signed_collateral_agreement:signed_collateral_agreement});
            users[msg.sender] = user;
        }

    }

    function takeLoan(string memory borrower_name, string memory identification,
        uint loan_id, uint credit_score, bool signed_collateral_agreement) public  {
        require(credit_score >= 600, "We can't lend to low credit borrowers");
        require(signed_collateral_agreement, "We can't lend without you agreeing for the collateral");
        
        if (users[msg.sender].id == 0) {
            User memory user = User({id: user_id_counter++, name: borrower_name, identification: identification,credit_score:credit_score,signed_collateral_agreement:signed_collateral_agreement});
            users[msg.sender] = user;
        }

        (uint at_index, bool found) = find_offer(loan_id);
        require(found, "Loan not available");
        require(loans[at_index].status == 3, "Loan already taken by someone else");
        require(loans[at_index].lender != msg.sender, "Don't try to trick the system");
        
        //all good. give out loan
        loans[at_index].borrower = msg.sender;
        loans[at_index].status = 1; //activate loan
        loans[at_index].activated_at = block.timestamp;
        _transfer(address(this) , msg.sender,loans[at_index].amount);
    }

    ///term is in days
    function offerLoan(string memory lender_name, string memory identification,uint term, uint interest_rate , uint numTokens) public  {
        require(numTokens != 0, "Poor you. Please offer some money at least");
        require(term != 0, "term cannot be 0 months");
        if (users[msg.sender].id == 0) {
            User memory user = User({id: user_id_counter++, name: lender_name, identification: identification,credit_score:0,signed_collateral_agreement:false});
            users[msg.sender] = user;
        }

        Loan memory offer = Loan({id: loan_id_counter++, amount: numTokens, repaid_amt: 0, term: term,
         rate: interest_rate, lender: msg.sender, borrower: address(0), status: 3, activated_at: 0});  //open offer

        loans.push(offer);

        balances[msg.sender] += numTokens;
        transfer(address(this), numTokens);

        //if this fails, all the above state changes will be reverted
    }



    function getBal() public view returns(uint){
        return address(this).balance;
    }

    function getTotalProcessed() view public returns(uint, uint){
        uint loans_until_now = loans.length;
        uint clients_served = 0;
        for (uint j = 0; j < loans.length ; j += 1) {
            if(loans[j].status == 2){
                clients_served += 2;
            } else {
                clients_served += 1;
            }
        }

        return (loans_until_now, clients_served);
    }

    function cancelOffer(uint offer_id) public payable{

        (address payable lender_addr, uint amount_to_return) = removeOffering(offer_id);
        require(address(this).balance >= amount_to_return, "Low Contract Wallet Balance");
        balances[msg.sender] -= amount_to_return;
        lender_addr.transfer(amount_to_return);
    }

    function removeOffering(uint offer_id) private returns(address payable, uint) {

        (uint at_index, bool found) = find_offer(offer_id);

        require(found, "Offering Id not found. Please check");
        require(loans[at_index].lender == msg.sender, "Only the one who posted the offer can cancel the offer");
        require(loans[at_index].status == 3, "Only open offers can be cancelled");

        address payable lender_addr = payable(loans[at_index].lender);
        uint amount_to_return = loans[at_index].amount;
        loans[at_index] = loans[loans.length - 1];
        loans.pop();

        return (lender_addr, amount_to_return);
    }

    function find_offer(uint offer_id) public view returns (uint, bool) {
        for (uint j = 0; j < loans.length ; j += 1) {
            if(loans[j].id == offer_id){
                return (j, true);
            }
        }
        return (0, false);
    }

    constructor () public ERC20("Mudra", "MDR") { //uint256 initialSupply
        admin = msg.sender;
        user_id_counter = 1;
        loan_id_counter = 1;
        late_fine = 4000;
        _mint(msg.sender, 1000000);   //uint256 initialSupply
        // payable(address(this)).transfer(msg.value);
    }

}