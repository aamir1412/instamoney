pragma solidity >=0.4.22 <=0.6.0;

contract InstaMoney {

    address public admin;
    uint public user_id_counter;
    uint public offering_id_counter;
    uint public loan_id_counter;

    struct  User {
        uint id;
        string name;
        string identification;
    }

    struct Offering {
        uint id;
        uint amount;
        uint term;
        uint rate;
        address lender;
    }

    struct Loan {
        uint id;
        uint offering_id;
        address borrower;
        uint status;    // 1 = Active, 2 = PaidOff
        uint activated_at;      //timestamp
    }

    mapping(address => User) public users;
    mapping(address => uint) private balances;
    Loan[] public loans;
    Offering[] public offerings;

    modifier onlyAdmin()
    {
        require(msg.sender == admin, "Can only be executed by admin");
        _;
    }

    ///term is in days
    function offerLoan(string memory lender_name, string memory identification,
                        uint term, uint interest_rate) public payable {
        require(msg.value != 0, "Poor you. Please offer some money at least");
        if (users[msg.sender].id == 0) {
            User memory user = User({id: user_id_counter++, name: lender_name, identification: identification});
            users[msg.sender] = user;
        }

        Offering memory offer = Offering({id: offering_id_counter++, amount: msg.value, term: term,
         rate: interest_rate, lender: msg.sender});

        offerings.push(offer);

        balances[msg.sender] += msg.value;

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
        for (uint j = 0; j < loans.length ; j += 1) {
            require(loans[j].offering_id != offer_id, "Already executed loan cannot be cancelled");
            //cannot be cancelled since already executed as a loan
        }

        (address payable lender_addr, uint amount_to_return) = removeOffering(offer_id);
        require(address(this).balance >= amount_to_return, "Low Contract Wallet Balance");
        balances[msg.sender] -= amount_to_return;
        lender_addr.transfer(amount_to_return);
    }

    function removeOffering(uint offer_id) private returns(address payable, uint) {

        (uint at_index, bool found) = find_offer(offer_id);

        require(found, "Offering Id not found. Please check");
        require(offerings[at_index].lender == msg.sender, "Only the one who posted the offer can cancel the offer");

        address payable lender_addr = payable(offerings[at_index].lender);
        uint amount_to_return = offerings[at_index].amount;
        offerings[at_index] = offerings[offerings.length - 1];
        offerings.pop();

        return (lender_addr, amount_to_return);
    }

    function find_offer(uint offer_id) public view returns (uint, bool) {
        for (uint j = 0; j < offerings.length ; j += 1) {
            if(offerings[j].id == offer_id){
                return (j, true);
            }
        }
        return (0, false);
    }

    constructor () public payable {
        admin = msg.sender;
        user_id_counter = 1;
        offering_id_counter = 1;
        loan_id_counter = 1;
        payable(address(this)).transfer(msg.value);
    }

}