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




useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);

    if (session?.user) {
      const meta = session.user.user_metadata;
      const displayName = meta?.name ?? meta?.firstname ?? null;
      setCurrentUser({ ...session.user, displayName });
    } else {
      setCurrentUser(null);
    }
  });

  const { data: authListener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setSession(session);

      if (session?.user) {
        const meta = session.user.user_metadata;
        const userName = meta?.name ?? meta?.firstName ?? null;
        const id= session.user.id
        setCurrentUser({ ...session.user, userName,id });
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
        <AuthContext.Provider value={{session,signUpNewUser,signInUser,signOutUser,GooglesignInUser,currentUser}}>
            {children}
        </AuthContext.Provider>
    )


}

export const UserAuth=()=>{
    return useContext(AuthContext)
}

