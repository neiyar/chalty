import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import dp from "../assets/dp.webp"
import Nav from '../components/Nav'
import FollowButton from '../components/FollowButton'
import Post from '../components/Post'
import { setSelectedUser } from '../redux/messageSlice'

function Profile() {

    const { userName } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [postType, setPostType] = useState("posts")

    const { profileData, userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)

    const handleProfile = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/getProfile/${userName}`, { withCredentials: true })
            dispatch(setProfileData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleProfile()
    }, [userName])

    return (
        <div className='w-full min-h-screen bg-black'>

            {/* HEADER */}
            <div className='w-full h-[80px] flex justify-between items-center px-[30px] text-white'>
                <div onClick={() => navigate("/")}>
                    <MdOutlineKeyboardBackspace className='cursor-pointer w-[25px] h-[25px]' />
                </div>
                <div className='font-semibold text-[20px]'>{profileData?.userName}</div>
                <div className='cursor-pointer text-[20px] text-blue-500' onClick={handleLogOut}>
                    Log Out
                </div>
            </div>

            {/* PROFILE INFO */}
            <div className='w-full h-[150px] flex gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center'>

                <div className='w-[80px] h-[80px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden'>
                    <img src={profileData?.profileImage || dp} alt="" className='w-full object-cover' />
                </div>

                <div>
                    <div className='font-semibold text-[22px] text-white'>{profileData?.name}</div>
                    <div className='text-[#ffffffe8]'>{profileData?.profession || "New User"}</div>
                    <div className='text-[#ffffffe8]'>{profileData?.bio}</div>
                </div>
            </div>

            {/* STATS */}
            <div className='w-full flex justify-center gap-[40px] md:gap-[60px] pt-[30px] text-white'>

                {/* POSTS */}
                <div>
                    <div className='text-[22px] md:text-[30px] font-semibold'>
                        {profileData?.posts?.length || 0}
                    </div>
                    <div className='text-[#ffffffc7]'>Posts</div>
                </div>

                {/* FOLLOWERS */}
                <div>
                    <div className='flex items-center gap-[20px]'>

                        <div className='flex relative'>
                            {profileData?.followers?.slice(0, 3).map((user, index) => (
                                <div
                                    key={user._id || index}
                                    className={`w-[40px] h-[40px] rounded-full overflow-hidden ${index > 0 ? "absolute" : ""}`}
                                    style={{ left: index * 10 }}
                                >
                                    <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                            ))}
                        </div>

                        <div className='text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.followers?.length || 0}
                        </div>
                    </div>
                    <div className='text-[#ffffffc7]'>Followers</div>
                </div>

                {/* FOLLOWING */}
                <div>
                    <div className='flex items-center gap-[20px]'>

                        <div className='flex relative'>
                            {profileData?.following?.slice(0, 3).map((user, index) => (
                                <div
                                    key={user._id || index}
                                    className={`w-[40px] h-[40px] rounded-full overflow-hidden ${index > 0 ? "absolute" : ""}`}
                                    style={{ left: index * 10 }}
                                >
                                    <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                            ))}
                        </div>

                        <div className='text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.following?.length || 0}
                        </div>
                    </div>
                    <div className='text-[#ffffffc7]'>Following</div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className='flex justify-center gap-[20px] mt-[20px]'>

                {profileData?._id === userData?._id ? (
                    <button onClick={() => navigate("/editprofile")} className='bg-white px-4 py-2 rounded-2xl'>
                        Edit Profile
                    </button>
                ) : (
                    <>
                        <FollowButton
                            tailwind='bg-white px-4 py-2 rounded-2xl'
                            targetUserId={profileData?._id}
                            onFollowChange={handleProfile}
                        />
                        <button
                            className='bg-white px-4 py-2 rounded-2xl'
                            onClick={() => {
                                dispatch(setSelectedUser(profileData))
                                navigate("/messageArea")
                            }}
                        >
                            Message
                        </button>
                    </>
                )}
            </div>

            {/* POSTS SECTION */}
            <div className='flex justify-center mt-[20px]'>
                <div className='w-full max-w-[900px] bg-white rounded-t-[30px] p-[20px]'>

                    {profileData?._id === userData?._id && (
                        <div className='flex justify-center gap-[10px] mb-[20px]'>

                            <div
                                onClick={() => setPostType("posts")}
                                className={`px-4 py-2 rounded-full cursor-pointer ${postType === "posts" ? "bg-black text-white" : ""}`}
                            >
                                Posts
                            </div>

                            <div
                                onClick={() => setPostType("saved")}
                                className={`px-4 py-2 rounded-full cursor-pointer ${postType === "saved" ? "bg-black text-white" : ""}`}
                            >
                                Saved
                            </div>
                        </div>
                    )}

                    <Nav />

                    {/* POSTS RENDER */}
                    {profileData?._id === userData?._id ? (
                        <>
                            {postType === "posts" &&
                                postData.map(post =>
                                    post.author?._id === profileData?._id ? (
                                        <Post key={post._id} post={post} />
                                    ) : null
                                )
                            }

                            {postType === "saved" &&
                                postData.map(post =>
                                    userData?.saved?.includes(post._id) ? (
                                        <Post key={post._id} post={post} />
                                    ) : null
                                )
                            }
                        </>
                    ) : (
                        postData.map(post =>
                            post.author?._id === profileData?._id ? (
                                <Post key={post._id} post={post} />
                            ) : null
                        )
                    )}

                </div>
            </div>
        </div>
    )
}

export default Profile