import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import dp from "../assets/dp.webp"

function Search() {
  const navigate = useNavigate()

  // ✅ FIXED STATES
  const [input, setInput] = useState("")
  const [searchData, setSearchData] = useState([])
  const [loading, setLoading] = useState(false)

  // 🔍 API CALL
  const handleSearch = async (query) => {
    try {
      setLoading(true)
      const result = await axios.get(
        `${serverUrl}/api/user/search?keyWord=${query}`,
        { withCredentials: true }
      )
      setSearchData(result.data || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // ⚡ DEBOUNCE (important for performance)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (input.trim() !== "") {
        handleSearch(input)
      } else {
        setSearchData([])
      }
    }, 400) // 400ms delay

    return () => clearTimeout(delay)
  }, [input])

  return (
    <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px]'>

      {/* BACK BUTTON */}
      <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] absolute top-0'>
        <MdOutlineKeyboardBackspace
          className='text-white cursor-pointer w-[25px] h-[25px]'
          onClick={() => navigate(`/`)}
        />
      </div>

      {/* SEARCH BAR */}
      <div className='w-full h-[80px] flex items-center justify-center mt-[80px]'>
        <div className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]'>
          <FiSearch className='w-[18px] h-[18px] text-white' />

          <input
            type="text"
            placeholder='Search...'
            className='w-full h-full outline-0 rounded-full px-[20px] text-white text-[18px]'
            value={input}                          // ✅ never null
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className='text-white text-[18px]'>Searching...</div>
      )}

      {/* RESULTS */}
      {!loading && input && searchData.map((user) => (
        <div
          key={user._id}   // ✅ FIXED KEY
          className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-white flex items-center gap-[20px] px-[5px] cursor-pointer hover:bg-gray-200'
          onClick={() => navigate(`/profile/${user.userName}`)}
        >
          <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
            <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
          </div>

          <div className='text-black text-[18px] font-semibold'>
            <div>{user.userName}</div>
            <div className='text-[14px] text-gray-400'>{user.name}</div>
          </div>
        </div>
      ))}

      {/* EMPTY STATE */}
      {!input && (
        <div className='text-[30px] text-gray-700 font-bold'>
          Search Here...
        </div>
      )}

      {/* NO RESULT */}
      {input && !loading && searchData.length === 0 && (
        <div className='text-gray-400 text-[18px]'>
          No users found
        </div>
      )}

    </div>
  )
}

export default Search