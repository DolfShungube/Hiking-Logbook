const { createClient } = require("@supabase/supabase-js");
const supabaseUrl=process.env.VITE_SUPABASE_URL
const supabasekey=process.env.VITE_SUPABASE_ANON_KEY

const supabase= createClient(supabaseUrl,supabasekey,{
        auth: {
        persistSession: true,
        autoRefreshToken: true,
         }
});



const signIn=async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.cookie("sb-access-token", data.session.access_token, {
    httpOnly: true, 
   // secure: true,  
    sameSite: "Strict",
    maxAge: 60*60*1000
  });

  res.status(200).json({
    message: "Login successful",
    user: data.user,
    session: data.session    
  });
}

const signInWithGoogle= async (req, res) => { 

   const { frontendBaseUrl } = req.body;
   const redirectTo = `${frontendBaseUrl}/dashboard`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.json({ url: data.url });


}

const signUp=async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstname: firstName,
        lastname: lastName,
      },
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ user: data.user });
}


module.exports={
    signIn,signInWithGoogle,signUp
}
