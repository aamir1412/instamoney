import "./BankRates.css";

function BankRates() {
  function confirmHandler() {
    console.log(bank_rates[0].bank);
  }
  const bank_rates = [
    { id: "b1", bank: "HDFC", rate: 11.25 },
    { id: "b2", bank: "ICICI", rate: 10.99 },
    { id: "b3", bank: "State Bank of India", rate: 8.0 },
    { id: "b4", bank: "Punjab National Bank", rate: 9.0 },
    { id: "b5", bank: "Axis Bank", rate: 10.75 },
  ];

  return (
    <div>
      <h2 className="item">Available rates</h2>
      <div className="container-div">
        <div className="box">
          <div className="item"> {bank_rates[0].bank} </div>
          <div className="item"> {bank_rates[0].rate} % </div>
        </div>
        <div className="padd">
          <button className="btn" onClick={confirmHandler}>
            Confirm
          </button>
        </div>
      </div>

      <div className="container-div">
        <div className="box">
          <div className="item"> {bank_rates[1].bank} </div>
          <div className="item"> {bank_rates[1].rate} % </div>
        </div>
        <div className="padd">
          <button className="btn" onClick={confirmHandler}>
            Confirm
          </button>
        </div>
      </div>

      <div className="container-div">
        <div className="box">
          <div className="item"> {bank_rates[2].bank} </div>
          <div className="item"> {bank_rates[2].rate} % </div>
        </div>
        <div className="padd">
          <button className="btn" onClick={confirmHandler}>
            Confirm
          </button>
        </div>
      </div>

      <div className="container-div">
        <div className="box">
          <div className="item"> {bank_rates[3].bank} </div>
          <div className="item"> {bank_rates[3].rate} % </div>
        </div>
        <div className="padd">
          <button className="btn" onClick={confirmHandler}>
            Confirm
          </button>
        </div>
      </div>
      <div className="container-div">
        <div className="box">
          <div className="item"> {bank_rates[4].bank} </div>
          <div className="item"> {bank_rates[4].rate} % </div>
        </div>
        <div className="padd">
          <button className="btn" onClick={confirmHandler}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default BankRates;
