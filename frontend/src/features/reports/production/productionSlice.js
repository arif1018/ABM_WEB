import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import purchaseService from './productionService'


const initialState = {
    Prod: [],
    BarCodeData: [],
    Machines: [],
    dataForDelete: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
}

export const getTableData = createAsyncThunk('Prod/GTD', async(EntDate, thunkAPI)=>{
    try {
        return await purchaseService.getTableData(EntDate)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const BarCode_Production = createAsyncThunk('ProdSticker/get', async(userData, thunkAPI)=>{
    try {
        return await purchaseService.BarCode_Production(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const addNewRecord = createAsyncThunk('ANR_Prod/post', async(userData, thunkAPI)=>{
    try {
        return await purchaseService.addNewRecord(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteRecord = createAsyncThunk('DR_Prod/post', async(userData, thunkAPI)=>{
    try {
        return await purchaseService.deleteRecord(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getMachines = createAsyncThunk('Prod_Machine/GTD', async(_, thunkAPI)=>{
    try {
        return await purchaseService.getMachines()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const stockSlice = createSlice({
    name: 'PurchaseMaster',
    initialState,
    reducers:{
        reset:(state)=>{
            state.Prod =  []
            state.BarCodeData =  []
            state.Machines =  []
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ""
        
        }

    },
    extraReducers:(builder)=>{
        builder
            .addCase(getTableData.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getTableData.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.Prod = action.payload
            })
            .addCase(getTableData.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.Prod = []
            })
            .addCase(BarCode_Production.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(BarCode_Production.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.BarCodeData = action.payload
            })
            .addCase(BarCode_Production.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(addNewRecord.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(addNewRecord.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.BarCodeData = action.payload
            })
            .addCase(addNewRecord.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteRecord.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(deleteRecord.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.dataForDelete = action.payload
            })
            .addCase(deleteRecord.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getMachines.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getMachines.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.Machines = action.payload
            })
            .addCase(getMachines.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
        }
})

export const { reset } = stockSlice.actions

export default stockSlice.reducer