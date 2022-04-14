import classes from './Lend.module.css';

function Lend(){
    const id = 'e1'
    const BankName = 'Axis';
    const Amount = '1000';
    const rate = 10.75; 
    

    return( 
    <div >   
        <div className={classes.enter_lend}> Enter your details </div>             
        
        <div className={classes.box_lend}>Name: {BankName}</div>
        <div className={classes.box_lend}>Amount: ${Amount} </div>
        <div className={classes.box_lend}>rate: {rate}</div>
        
    </div>
    );
}

export default Lend;