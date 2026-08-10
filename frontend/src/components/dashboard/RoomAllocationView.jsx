import { useState, useMemo } from 'react';
import StudentAddModal from './StudentAddModal';

function RoomAllocationView({ students, onStudentAdded }) {
  const [selectedFloor, setSelectedFloor] = useState('1');
  const [selectedWing, setSelectedWing] = useState('A');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Generate hostel layout data
  const hostelData = useMemo(() => {
    // Define wing types
    const wings = ['A', 'B'];
    const floors = ['1', '2', '3', '4', '5'];
    
    // Define room numbers per wing per floor (each wing has rooms 01-15 on each floor)
    const generateRoomNumbers = (wing, floor) => {
      return Array.from({ length: 15 }, (_, i) => {
        const roomNum = String(i + 1).padStart(2, '0');
        return `${wing}-${floor}${roomNum}`;
      });
    };
    
    // Generate all room numbers
    const allRooms = [];
    wings.forEach(wing => {
      floors.forEach(floor => {
        const roomsOnFloor = generateRoomNumbers(wing, floor);
        allRooms.push(...roomsOnFloor);
      });
    });
    
    // Group rooms by wing and floor
    const roomsByWingAndFloor = {};
    wings.forEach(wing => {
      roomsByWingAndFloor[wing] = {};
      floors.forEach(floor => {
        const roomsOnThisFloor = allRooms.filter(room => 
          room.startsWith(`${wing}-${floor}`)
        );
        
        // Initialize with student data
        const roomsMap = {};
        roomsOnThisFloor.forEach(roomNum => {
          // Find students in this room
          const studentsInRoom = students.filter(student => 
            student.roomNumber === roomNum
          );
          
          roomsMap[roomNum] = studentsInRoom;
        });
        
        roomsByWingAndFloor[wing][floor] = roomsMap;
      });
    });
    
    return {
      wings,
      floors,
      roomsByWingAndFloor,
      allRooms
    };
  }, [students]);

  const getMaxCapacity = (wing) => {
    // Wing A: 3-bedded, Wing B: 4-bedded
    return wing === 'A' ? 3 : 4;
  };
  
  const handleStudentClick = (student) => {
    alert(`
      Name: ${student.name}
      Registration: ${student.registrationNumber}
      Phone: ${student.phoneNumber}
      Email: ${student.email}
      Room: ${student.roomNumber}
      Mess: ${student.mess || 'Not assigned'}
    `);
  };

  const handleEmptyBedClick = (roomId) => {
    // Open add student modal with pre-filled room data
    setSelectedRoom({
      roomNumber: roomId,
      hostelBlock: 'Boys Hostel Block 6',
      roomType: selectedWing === 'A' ? '3 Bedded' : '4 Bedded'
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Boys Hostel Block 6</h2>
          <p className="text-sm text-gray-500">Room allocation view</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            <label className="mr-2 text-sm font-medium">Wing:</label>
            <select 
              value={selectedWing} 
              onChange={e => setSelectedWing(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              {hostelData.wings.map(wing => (
                <option key={wing} value={wing}>
                  Wing {wing} ({wing === 'A' ? '3-bedded' : '4-bedded'})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="mr-2 text-sm font-medium">Floor:</label>
            <select 
              value={selectedFloor} 
              onChange={e => setSelectedFloor(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              {hostelData.floors.map(floor => (
                <option key={floor} value={floor}>Floor {floor}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="w-full text-center p-4 border-b-2 border-gray-300 mb-8">
          <p className="text-lg font-semibold">
            Wing {selectedWing} - Floor {selectedFloor} 
            <span className="text-sm ml-2 text-gray-500">
              ({selectedWing === 'A' ? '3-bedded' : '4-bedded'} rooms)
            </span>
          </p>
        </div>
        
        {/* Room Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-6">
          {Array.from({ length: 15 }, (_, i) => {
            const roomNum = String(i + 1).padStart(2, '0');
            const roomId = `${selectedWing}-${selectedFloor}${roomNum}`;
            const roomStudents = hostelData.roomsByWingAndFloor[selectedWing]?.[selectedFloor]?.[roomId] || [];
            const maxCapacity = getMaxCapacity(selectedWing);
            const occupancy = roomStudents.length;
            const isOccupied = occupancy > 0;
            
            return (
              <div 
                key={roomId}
                className={`p-4 rounded-lg shadow-md transition-transform hover:shadow-lg hover:scale-105 cursor-pointer
                  ${isOccupied 
                    ? occupancy >= maxCapacity 
                      ? 'bg-red-100 border border-red-300'  // Full
                      : 'bg-yellow-100 border border-yellow-300' // Partially occupied
                    : 'bg-green-100 border border-green-300' // Empty
                  }`}
              >
                <div className="text-center mb-3 font-bold">
                  <span className="text-lg">{roomId}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedWing === 'A' ? '3-bedded' : '4-bedded'}
                  </div>
                </div>
                
                {/* Bed visualization */}
                <div className={`grid ${selectedWing === 'A' ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
                  {Array.from({ length: maxCapacity }, (_, bedIndex) => {
                    const student = roomStudents[bedIndex];
                    return (
                      <div 
                        key={`${roomId}-${bedIndex}`}
                        className={`
                          h-12 rounded flex items-center justify-center text-xs text-center p-1
                          ${student 
                            ? 'bg-blue-500 text-white cursor-pointer'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300 cursor-pointer'
                          }
                        `}
                        onClick={() => student 
                          ? handleStudentClick(student) 
                          : handleEmptyBedClick(roomId)
                        }
                        title={student ? student.name : 'Click to add a student to this bed'}
                      >
                        {student ? student.name.split(' ')[0] : 'Empty'}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 text-center text-xs text-gray-500">
                  {occupancy}/{maxCapacity} occupied
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Elevator/Stairs section */}
        <div className="mt-8 p-4 bg-gray-200 rounded-lg w-full md:w-1/3 mx-auto text-center">
          <div className="font-bold mb-2">Common Area</div>
          <div className="flex justify-around">
            <div className="bg-gray-400 p-2 rounded text-white">Elevators</div>
            <div className="bg-gray-400 p-2 rounded text-white">Stairs</div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm">Vacant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-sm">Partially Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-sm">Fully Occupied</span>
          </div>
        </div>
        
        {/* Wing information */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Wing Information:</h3>
          <ul className="text-sm space-y-1">
            <li>• Wing A: All rooms are 3-bedded</li>
            <li>• Wing B: All rooms are 4-bedded</li>
            <li>• Room naming follows format: [Wing]-[Floor][Room Number]</li>
            <li>• Example: A-101 = Wing A, 1st Floor, Room 01</li>
          </ul>
        </div>
      </div>

      {/* Add student modal */}
      <StudentAddModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedRoom(null);
        }}
        prefillData={selectedRoom}
        fixedRoomData={true}
        onAddSuccess={() => {
          setIsAddModalOpen(false);
          setSelectedRoom(null);
          if (onStudentAdded) onStudentAdded();
        }}
      />
    </div>
  );
}

export default RoomAllocationView;
