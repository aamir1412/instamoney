pragma solidity >=0.4.22 <=0.6.0;

contract InstaMoney {

    address broker;
    uint net_funds;
    int user_id_counter;

    struct  User {
        int id;
        string name;
        string identification;
    }

    struct Offering {
        uint id;
        uint amount;
        uint term;
        uint rate;
        uint status;    // 1 = Offered, 2 = Active, 3 = PaidOff
        address lender;
        uint ts;        //timestamp
    }

    struct Loan {
        uint id;
        uint offeringId;
        address borrower;
        uint ts;
    }

    // struct Transaction {
    //     int amount;
    //     uint type;          // 1: deposit, 2: withdrawn
    //     uint timestamp;
    // }

    // Transaction[] transactions;

    mapping(address => User) users;

    modifier onlyBroker()
    {
        require(msg.sender == broker, "Can only be executed by admin");
        _;
    }

    ///term is in days
    function offerLoan(string memory lender_name, string memory identification, 
                        uint term, uint interest_rate) public payable {
        if (users[msg.sender].id == 0) {
            User memory user = User({id: user_id_counter++, name: lender_name, identification: identification});
            users[msg.sender] = user;
        }

    }

    constructor () public {
        broker = msg.sender;
        net_funds = 0;
        user_id_counter = 1;
    }

}