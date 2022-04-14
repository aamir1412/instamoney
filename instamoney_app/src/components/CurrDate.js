import './CurrDate.css';
import './Borrow.css'

function CurrDate(){
const date = new Date();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const month = months[(date.getMonth())];
const day =  date.getDate().toLocaleString('en-US', {day: '2-digit'});
const year = date.getFullYear();

return(
<div>
    <div >
        <div className='curr_date'>
            <div className='curr_month'>{day}th {month} {year}</div>                                                
        </div>
    </div> 
</div>
);
}

export default CurrDate;