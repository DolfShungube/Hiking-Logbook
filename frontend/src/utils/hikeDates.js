
export const extractDate=(mydate)=>{
const date = new Date(mydate);

const The_Date = date.toISOString().split("T")[0];
  const The_Time = date.toLocaleTimeString("en-GB", { 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: false 
  });   

return {date:The_Date,time:The_Time};

}



export  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };



export  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

export  const getDaysUntil = (dateString) => {
    const today = new Date();
    const hikeDate = new Date(dateString);
    const diffTime = hikeDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past';
    return `${diffDays} days`;
  };  