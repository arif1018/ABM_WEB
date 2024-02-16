import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import stockAllService from './stockService'


const initialState = {
    stock: [],
    ItemList: [],
    // adsEngFD: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
}

export const stockGetAll = createAsyncThunk('stockAll/get', async(thunkAPI)=>{
    try {
        return await stockAllService.getStockAll()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getAllItemName = createAsyncThunk('AllItemName/get', async(thunkAPI)=>{
    try {
        return await stockAllService.getAllItemName()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// export const getAdsEng = createAsyncThunk('AdsEng/get', async(_, thunkAPI)=>{
//     try {
//         const token = thunkAPI.getState().auth.user.token
//         return await adsEngAllService.getAdsEng(token)
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
//         return thunkAPI.rejectWithValue(message)
//     }
// })

// export const getAdsEngForDelete = createAsyncThunk('AdsEngFDel/get', async(id, thunkAPI)=>{
//     try {
//         console.log(id)
//         const token = thunkAPI.getState().auth.user.token

//         return await adsEngAllService.getAdsEngForDelete(id, token)
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
//         return thunkAPI.rejectWithValue(message)
//     }
// })

// export const deleteAdsEng = createAsyncThunk('DelEngAd/get', async(id, thunkAPI)=>{
//     try {
//         console.log(id)
//         const token = thunkAPI.getState().auth.user.token

//         return await adsEngAllService.deleteAdsEng(id, token)
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
//         return thunkAPI.rejectWithValue(message)
//     }
// })
export const getstockPartyWise = createAsyncThunk('stockPW/get', async(thunkAPI)=>{
    try {
        return await stockAllService.getStockPartyWise()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// export const addEngAd = createAsyncThunk('AdsEng/addNewAd', async(adData, thunkAPI)=>{
//     try {
//         const token = thunkAPI.getState().auth.user.token
//         return await adsEngAllService.addEngNewAd(adData, token)
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
//         return thunkAPI.rejectWithValue(message)
//     }
// })

export const stockSlice = createSlice({
    name: 'stockAll',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ""
            state.stock = []
            state.ItemList = []
        }

    },
    extraReducers:(builder)=>{
        builder
            .addCase(stockGetAll.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(stockGetAll.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.stock = action.payload
            })
            .addCase(stockGetAll.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.stock = []
            })
            .addCase(getAllItemName.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getAllItemName.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.ItemList = action.payload
            })
            .addCase(getAllItemName.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.ItemList = []
            })
            .addCase(getstockPartyWise.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getstockPartyWise.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.stock = action.payload
            })
            .addCase(getstockPartyWise.rejected, (state, action)=>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.stock = []
            })
            // .addCase(addEngAd.pending, (state)=>{
            //     state.isLoading = true 
            // })
            // .addCase(addEngAd.fulfilled, (state, action)=>{
            //     state.isLoading = false
            //     state.isSuccess = true
            //     state.adsEng.push(action.payload)
            // })
            // .addCase(addEngAd.rejected, (state, action)=>{
            //     state.isLoading = false
            //     state.isError = true
            //     state.message = action.payload
            // })
            // .addCase(getAdsEng.pending, (state)=>{
            //     state.isLoading = true
            // })
            // .addCase(getAdsEng.fulfilled, (state, action)=>{
            //     state.isLoading = false
            //     state.isSuccess = true
            //     state.adsEng = action.payload
            // })
            // .addCase(getAdsEng.rejected, (state, action)=>{
            //     state.isLoading = false
            //     state.isError = true
            //     state.message = action.payload
            //     state.adsEng = []
            // })
            // .addCase(getAdsEngForDelete.pending, (state)=>{
            //     state.isLoading = true
            // })
            // .addCase(getAdsEngForDelete.fulfilled, (state, action)=>{
            //     state.isLoading = false
            //     state.isSuccess = true
            //     state.adsEngFD = action.payload
            // })
            // .addCase(getAdsEngForDelete.rejected, (state, action)=>{
            //     state.isLoading = false
            //     state.isSuccess = false
            //     state.isError = true
            //     state.message = action.payload
            //     state.adsEngFD = null
            // })
            // .addCase(deleteAdsEng.pending, (state)=>{
            //     state.isLoading = true
            // })
            // .addCase(deleteAdsEng.fulfilled, (state, action)=>{
            //     state.isLoading = false
            //     state.isSuccess = true
            //     state.message = action.payload
            // })
            // .addCase(deleteAdsEng.rejected, (state, action)=>{
            //     state.isLoading = false
            //     state.isSuccess = false
            //     state.isError = true
            //     state.message = action.payload
            //     state.adsEngFD = null
            // })
        }
})

export const { reset } = stockSlice.actions

export default stockSlice.reducer