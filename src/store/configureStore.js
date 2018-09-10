import { createStore, applyMiddleware , compose} from 'redux'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import createSagaMonitor from '../sagaMonitor'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
export default function configureStore(initialState = {}) {
  //const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
  // configuration
  const config = {
    level: 'log',
    effectTrigger: true,
    effectResolve: true,
    actionDispatch: true
  }
  const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel1,
  }
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor: createSagaMonitor(config) })
  const middleware = [
    // create saga middleware w/ sagaMonitor
    sagaMiddleware
  ];
  const enhancers = [
    /* [middlewares] */
    applyMiddleware(...middleware),

  ];
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  let store              = createStore(persistedReducer,initialState,compose(...enhancers))
  let persistor          = persistStore(store)
  return{
    ...store,
    persistor,
    runSaga:sagaMiddleware.run,
  } 
}