export const toLocaleDateFromBigInt = (dateFromBigInt) => {
    const date = new Date(parseInt(dateFromBigInt?.toString())*1000);

    let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    const offset = newDate.getTimezoneOffset() / 60;
    const hours = newDate.getHours();

    newDate.setHours(hours - offset);

    return newDate.toLocaleString();  
}