import { createClient } from "@supabase/supabase-js";
import { createContext,useEffect,useState,useContext } from "react";
const supabaseUrl=import.meta.env.VITE_SUPABASE_URL;
const supabasekey=import.meta.env.VITE_SUPABASE_ANON_KEY;



const supabase= createClient(supabaseUrl,supabasekey,{
        auth: {
        persistSession: true,
        autoRefreshToken: true,
         }
});

const AuthContext= createContext()

export const AuthContextProvider=({children})=>{


    const [session,setSession]= useState(undefined)
    const [currentUser,setCurrentUser]= useState()
    const [authLoading, setLoading] = useState(true);
const signUpNewUser = async (firstName,lastName,email,password ) => {
  try {

    const res = await fetch('https://hiking-logbook-api.onrender.com/signup', {
    
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName:firstName,
        lastName:lastName,
        email: email,
        password: password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return data
      throw new Error(`HTTP error! Status: ${res.status}`);
    }






    console.log(data)
    return data;
  } catch (err) {
    console.error("Sign-up error:", err);
    throw err;
  }
};




const signInUser = async (email, password) => {
   console.log("fetching")
  try {
    const res = await fetch('https://hiking-logbook-api.onrender.com/signin', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await res.json();
      
    if (!res.ok) {

      console.log(data.error, "dolf") // function to show error message
    

       return {data,res}
      //throw new Error( data.error ||`HTTP error! Status: ${res.status}`);
    }



  if (data.session) {
    await supabase.auth.setSession(data.session);
  }    
    return data;
  } catch (err) {

    console.error("Sign-in error:", err);
    throw err;
  }
};


const GooglesignInUser = async () => {
  try {
    const res = await fetch("https://hiking-logbook-api.onrender.com/googlesignin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ frontendBaseUrl: window.location.origin }),
});

    const { url } = await res.json();
    window.location.href = url;
  } catch (err) {

    return {error:err};

  }
};


const signOutUser= async()=>{
    const {error}= await supabase.auth.signOut() // to use in the dashboard

    if(error){
      console.log(error)
    }
}


//use render when we are ready to implement and deploy


const updateHikeStatus= async(hikeId,status)=>{
    try{
        const res= await fetch('https://hiking-logbook-api.onrender.com/HikeStatus',{ 
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({hikeId,status})
        })}catch(err){
            console.log(err)
        }
};


const getHikeID = async (userId)=>{
    try{
        const res= await fetch(`https://hiking-logbook-api.onrender.com/userHikeId/${userId}`)
        const data= await res.json();
        return data
    }catch(err){
        console.log(err)
    } 
};





  useEffect(() => {
    // 1. Load session from Supabase (cached in localStorage)
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session?.user) {
        const meta = session.user.user_metadata;
        const displayName = meta?.name ?? meta?.firstname ?? null;
        setCurrentUser({ ...session.user, displayName });
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    };

    getInitialSession();

    // 2. Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        if (session?.user) {
          const meta = session.user.user_metadata;
          const userName = meta?.name ?? meta?.firstName ?? null;
          setCurrentUser({ ...session.user, userName, id: session.user.id });
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
  const getInitialSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);

    if (session?.user) {
      const meta = session.user.user_metadata;
      const displayName = meta?.name ?? meta?.firstname ?? null;
      const createdAt = session.user.created_at; // ADD THIS
      
      setCurrentUser({ 
        ...session.user, 
        displayName,
        createdAt // ADD THIS
      });
    } else {
      setCurrentUser(null);
    }

    setLoading(false);
  };

  getInitialSession();

  const { data: authListener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setSession(session);

      if (session?.user) {
        const meta = session.user.user_metadata;
        const userName = meta?.name ?? meta?.firstName ?? null;
        const createdAt = session.user.created_at; // ADD THIS
        
        setCurrentUser({ 
          ...session.user, 
          userName, 
          id: session.user.id,
          createdAt // ADD THIS
        });
      } else {
        setCurrentUser(null);
      }
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);

    return (
        <AuthContext.Provider value={{session,signUpNewUser,signInUser,signOutUser,GooglesignInUser,currentUser,authLoading}}>
            {children}
        </AuthContext.Provider>
    )


  
  

}

export const UserAuth=()=>{
    return useContext(AuthContext)
}

