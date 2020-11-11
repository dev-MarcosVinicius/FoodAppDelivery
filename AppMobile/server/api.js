import {create} from 'apisauce'; 

const api = create({
  baseURL:'http://192.168.1.18:3000',
});

api.addAsyncRequestTransform(response => async () =>{
  const token = await AsyncStorage.getItem('@Api:token');
  if (token) 
     request.headers['Authorization'] = 'Bearer ${token}';
});

api.addResponseTransform(response => {
  if (!response.ok) throw response;
})

export default api