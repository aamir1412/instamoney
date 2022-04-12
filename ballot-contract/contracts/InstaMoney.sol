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
        address lender;
        uint ts;        //timestamp
    }

    struct Loan {
        uint id;
        uint offeringId;
        address borrower;
        uint status;    // 1 = Active, 2 = PaidOff
        uint ts;
    }

    mapping(address => User) public users;
    Loan[] public loans;
    Offering[] public offerings;

    modifier onlyBroker()
    {
        require(msg.sender == broker, "Can only be executed by admin");
        _;
    }

    ///term is in days
    function offerLoan(string memory lender_name, string memory identification) public
                      //  uint term, uint interest_rate) public payable 
                        {
        if (users[msg.sender].id == 0) {
            User memory user = User({id: user_id_counter++, name: lender_name, identification: identification});
            users[msg.sender] = user;
        }

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
            if(loans[j].offeringId == offer_id){
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
    }

}