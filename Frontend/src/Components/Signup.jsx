import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye,EyeClosed } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bio, setBio] = useState('');
  const[showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(true);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("bio", bio);

    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    } else {
      const initial = fullName.charAt(0).toUpperCase();
      const imageUrl = `https://api.dicebear.com/9.x/initials/png?seed=${initial}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      formData.append("profilePhoto", blob, `${fullName}_avatar.png`);
    }

    try {
      const res = await axios.post('/chatApp/api/v1/user/register', formData);
      toast.success("User created successfully!");
      navigate('/login');
    } catch (err) {
      if (err?.response?.status === 402) {
        toast.error("User already exists");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setStatus(false);
    }
  }

  return (
    <div className="bg-slate-950 p-5 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg">
  <div className="flex flex-row items-center justify-center ">
  <h1 className="text-white text-2xl font-bold text-center mb-2">
     Create Account
  </h1>
</div>
        <form onSubmit={handleSubmit}>
          <div className="relative z-0 mb-4">
            <input
              type="text"
              id="signup_fullName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <label
              htmlFor="signup_fullName"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your name
            </label>
          </div>

          <div className="relative z-0 mb-4">
            <input
              type="email"
              id="signup_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label
              htmlFor="signup_email"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your email
            </label>
          </div>

          <div className="relative z-0 mb-4">
            <input
              type={showPassword?"text":"password"}
              pattern="^\d{8}$"
              title="Password must be exactly 8 digits"
              id="signup_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label
              htmlFor="signup_password"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your password
            </label>
          <button type="button" className="absolute right-0 top-2.5 " onClick={()=>{
              setShowPassword(showPassword?false:true)
            }}>{showPassword?<EyeClosed color="white"/>: <Eye color="white"/>}</button>
          </div>

          <label htmlFor="signup_bio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your Bio
          </label>
          <textarea
            id="signup_bio"
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
            placeholder="Write your thoughts here..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          ></textarea>

          <label htmlFor="signup_file_input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Upload Profile Photo (Optional)
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-4"
            id="signup_file_input"
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />

          {status ? (
            <button
              disabled
              type="button"
              className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 inline-flex items-center w-full justify-center"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </button>
          ) : (
            <button
              type="submit"
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 w-full"
            >
              SignUp
            </button>
          )}
        </form>

        <p className="text-white mt-4 text-center">
          Already a user? <Link to="/login" className="text-blue-400">Login</Link>
        </p>
      </div>
    </div>
  );
}