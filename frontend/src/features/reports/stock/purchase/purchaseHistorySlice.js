import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import partyLedgerService from './purchaseHistoryService'


const initialState = {
    phmData: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
}

export const getData = createAsyncThunk('stock/PHMD', async(thunkAPI)=>{
    try {
        return await partyLedgerService.getData()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


export const partyLedgerSlice = createSlice({
    name: 'PartyLedger',
    initialState,
    reducers:{
        reset:(state)=>{
            state.phmData =  []
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
                state.phmData = action.payload
            })
            .addCase(getData.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.phmData = []
            })
        }
})

export const { reset } = partyLedgerSlice.actions

export default partyLedgerSlice.reducer