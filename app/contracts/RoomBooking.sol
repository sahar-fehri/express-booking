// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;


contract RoomBooking {
    
    enum RoomState { AVAILABLE, BOOKED}
    
    struct Room {
        uint256 idRoom;
        uint256 from;
        uint256 to;
        address user;
        RoomState state;
    }
    
    struct Company{
        uint256 maxReservations;
        uint256 numberOfReservations;
    }
    
    mapping(uint256 => Room) public bookings; // map idBooking to Room
    mapping(uint256 => Room) public rooms; // map idRoom to Romm for easier check for Room status
    mapping(bytes32 => Company) public companyReservations;
    
    uint256[] public arrayBookingIds;
    event ShowBookingId(uint256 id); // to be removed just for dev
    event Booked(uint256 idRoom, uint256 from, uint256 to, bytes32 company);
    event Canceled(uint256 idRoom, uint256 from, uint256 to, bytes32 company);
    
    
    constructor(uint limitNumber, bytes32 colaCompany, bytes32 pepsiCompany) {
        companyReservations[colaCompany].maxReservations = limitNumber;
        companyReservations[pepsiCompany].maxReservations = limitNumber;
    }
    
    /**
    * @notice books a certain room for a user
    * @param idRoom for simplicity we suppose idRooms will be from 0 to 19
    * @param from timestamp of the start of booking
    * @param to timestamp of the end of booking
    * @param company of the user sending the tx
    * @return idBooking will be combination of idRoom and from and to params, this will make some checks easier because the hash of a certain (idRoom,from,to) will always be the same
    */
    function book(uint256 idRoom, uint256 from, uint256 to, bytes32 company) external returns(uint256 idBooking){
        require(companyReservations[company].numberOfReservations < companyReservations[company].maxReservations, "This company has reached reservation limit");
        require(from < to , "wrong args from to");
        Room memory room;
        room.idRoom = idRoom;
        room.from = from;
        room.to = to;
        room.user = msg.sender;
        uint256 bookingId = uint256(
            keccak256(
                abi.encodePacked(
                    idRoom,
                    from,
                    to
                )
            )
        );
        
        if(bookings[bookingId].state == RoomState.BOOKED ){ // if found the exact ID then revert no need to loop
            revert('Already booked');
        } else { // if it is not found it doesn't mean that it can be booked, exp room id0 can be booked from 8AM->9AM but he asks to book from 8AM to 10 AM, Id wont exist in mapping but he can't book
            bool foundAvailibility = true;
            for (uint i=0; i<arrayBookingIds.length; i++) {
               if(bookings[arrayBookingIds[i]].idRoom == idRoom && bookings[arrayBookingIds[i]].state == RoomState.BOOKED ){
                   if(!(from >= bookings[arrayBookingIds[i]].to || to <= bookings[arrayBookingIds[i]].from)){
                       foundAvailibility = false;
                       break;
                   }
               }
            }
            if(!foundAvailibility){
                revert('Slot Already Booked');
            }else{
                room.state = RoomState.BOOKED;
                bookings[bookingId] = room;
                companyReservations[company].numberOfReservations ++;
                arrayBookingIds.push(bookingId);
                emit Booked(idRoom, from, to, company);
                emit ShowBookingId(bookingId);
                return bookingId;
            }
        }
    }
    
    /**
    * @notice cancels a certain room for a user
    * @param idBooking that corresponds to (idRoom, from, to) that user wants to cancel
    * @param company of the user sending the tx
    */
    function cancel(uint256 idBooking, bytes32 company)external{
        require(bookings[idBooking].user == msg.sender , "You did not book this slot");
        require(bookings[idBooking].state == RoomState.BOOKED, "Room is already available");
        companyReservations[company].numberOfReservations --;
        bookings[idBooking].state = RoomState.AVAILABLE;
        emit Canceled(bookings[idBooking].idRoom, bookings[idBooking].from, bookings[idBooking].to, company);
    }
    
}
