

 export const getRoomId = async (adminname, username) => {
    const sortedIds =[adminname, username].sort();
    const roomId = sortedIds.join('-');
    return roomId;
  };