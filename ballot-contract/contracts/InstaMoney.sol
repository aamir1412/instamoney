pragma solidity >=0.4.22 <=0.6.0;

contract InstaMoney {

    address payable public broker;
    uint public net_funds;
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
        bool is_active;
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

    modifier onlyBroker()
    {
        require(msg.sender == broker, "Can only be executed by admin");
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
         rate: interest_rate, lender: msg.sender, is_active: true});

        offerings.push(offer);

        balances[msg.sender] += msg.value;
        net_funds += msg.value;
        broker.transfer(msg.value);
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

    function cancelOffer(uint offer_id) public returns (bool){
        for (uint j = 0; j < loans.length ; j += 1) {
            if(loans[j].offering_id == offer_id){
                //cannot be cancelled since already executed as a loan
                return false;
            }
        }

        removeOffering(offer_id);
        return true;
    }

    function removeOffering(uint offer_id) private {
        bool found = false;
        uint at_index = 0;
        for (uint j = 0; j < offerings.length ; j += 1) {
            if(offerings[j].id == offer_id){
                at_index = j;
                found = true;
                break;
            }
        }
        if(found){
            offerings[at_index] = offerings[offerings.length - 1];
            offerings.pop();
        }
    }

    constructor () public {
        broker = msg.sender;
        net_funds = 0;
        user_id_counter = 1;
        offering_id_counter = 1;
        loan_id_counter = 1;
    }

}