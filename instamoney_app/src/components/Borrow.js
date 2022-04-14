import './Borrow.css';

function Borrow(){
    
    const Name = 'Aamir';
    const Amount = '1000';
    const ssn = '12345';
    const term = '18 months';
    const crd_scr = '700';


    return( 
    <div >   
        <div className="enter"> Enter your details and go to BankRates (top right) </div>             
        
        <div className='box'>Name: {Name}</div>
        <div className='box'>Amount: ${Amount} </div>
        <div className='box'>SSN: {ssn}</div>
        <div className='box'>Term: {term} </div>
        <div className='box'>Credit Score: {crd_scr}</div>
        
    </div>
    );
}

export default Borrow;