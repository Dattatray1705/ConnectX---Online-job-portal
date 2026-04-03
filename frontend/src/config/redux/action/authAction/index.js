import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    console.log("clicked");

    try {
      const response = await clientServer.post("/api/users/login", {
        email: user.email,
        password: user.password,
      });

      return response.data;

    } catch (error) {
      console.log("LOGIN ERROR:", error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/api/users/register", {
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
      });

      return response.data;

    } catch (error) {
      console.log("REGISTER ERROR:", error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Register failed"
      );
    }
  }
);


export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkAPI.rejectWithValue("Token missing");
      }

      const response = await clientServer.get(
        "/api/users/get_user_and_profile",
        {
          params: { token } // ✅ THIS IS THE KEY FIX
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);




export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI)=>{
    try{
     const response = await clientServer.get("/api/users/get_all_user")
      return thunkAPI.fulfillWithValue(response.data);
    }catch(error){
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      )
    }});
    

export const getConnectionRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async (user, thunkAPI) => {
    try {

      const response = await clientServer.get(
        "/api/users/user/getConnectionRequest",
        {
          params: {
            token: user.token
          }
        }
      );

      return response.data.requests;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);
export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI)=> {
    try {

      const response = await clientServer.post(
        "/api/users/user/send_connection_request",
        {
          token: user.token,
          connectionId: user.connectionId   // ✅ FIX
        }
      );

      thunkAPI.dispatch(getConnectionRequest({ token:user.token }))

      return thunkAPI.fulfillWithValue(response.data);

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);


export const getMyConnectionsRequest = createAsyncThunk(
  "user/getMyConnectionRequest",
  async (user, thunkAPI) => {
    try {

      const response = await clientServer.get(
        "/api/users/user/getMyConnections",
        {
          params: { token: user.token }
        }
      );

      return response.data.connections;   // ✅ important

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Empty Connection"
      );
    }
  }
);

export const acceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async(user,thunkAPI)=>{
    try{

      const response = await clientServer.post(
        "/api/users/user/acceptConnection_Request",
        {
          token:user.token,
          requestId:user.requestId,
          action_type:user.action
        }
      );

      thunkAPI.dispatch(getConnectionRequest({token:user.token}))
      thunkAPI.dispatch(getMyConnectionsRequest({token:user.token}))

      return response.data

    }catch(error){

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "request denied"
      )

    }
  }
)