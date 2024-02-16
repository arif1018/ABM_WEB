import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import salesHistoryService from './salesHistoryService'


const initialState = {
    shmData: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
}

export const getData = createAsyncThunk('stock/SHMD', async(thunkAPI)=>{
    try {
        return await salesHistoryService.getData()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


export const salesHistorySlice = createSlice({
    name: 'salesHistoryService',
    initialState,
    reducers:{
        reset:(state)=>{
            state.shmData =  []
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ""
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getData.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getData.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.shmData = action.payload
            })
            .addCase(getData.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.shmData = []
            })
        }
})

export const { reset } = salesHistorySlice.actions

export default salesHistorySlice.reducer