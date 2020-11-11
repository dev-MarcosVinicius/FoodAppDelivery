import React, { Component } from 'react';
import { Text, 
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity, 
  KeyboardAvoidingView, 
  TextInput, 
  Button, 
  ScrollView, 
  SafeAreaView,
  Alert,  
  } from 'react-native';

import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';


export default class App extends Component {

  constructor(props: Readonly<{}>)
  {
    super(props);
    this.state = {
      Name:'',
      Password:'',
      Email: '',
      Product:'',
      Status: 'Pendente',
      Dados:[],
      errorMessage: null,
      loggedInUser: null,
      typeUser: null,
      setToggleCheckBox: false,
      toggleCheckBox: false,
      LoginStatus: 0,
      SignInStatus: 0,
      viewLoggerInUser: 0
    }
  }

  async componentDidMount(){
    const type = JSON.parse(await AsyncStorage.getItem('@Api:typec'))
    const name = JSON.parse(await AsyncStorage.getItem('@Api:user'));

    if (name && type) {
      this.setState({typeUser:type}) 
      this.setState({loggedInUser:name})
    }
  }
  
  /* CRUD */
  getData(){
    axios.get('http://192.168.0.107:3000/')
    .then(res => {
        this.setState({ Dados:res.data });
            })
    .catch(function (error) {
        console.log(error);
    });
  }

  submitData = async () => {
    const user = JSON.parse( await AsyncStorage.getItem('@Api:email'))
    fetch("http://192.168.0.107:3000/send-data", {
      method:"post",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        emailp:user,
        productc:this.state.Product,
        statusc:this.state.Status,
      })
    })
    .then(res=>res.json())

    this.setState({Product:''})
    Alert.alert('Item Adicionado')
  }

  cadastroLogin(){
    try {
    fetch("http://192.168.0.107:3000/register", {
      method:"post",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        namec:this.state.Name,
        emailc:this.state.Email,
        passwordc:this.state.Password,
      })
    })
    .then(res=>res.json())
    Alert.alert("Cadastro realizado com sucesso")
  } catch (err) {
    Alert.alert(err)
  }
    this.setState({Name:''})
    this.setState({Password:''})
    this.setState({Email:''})
    this.setState({SignInStatus:0})
    this.setState({LoginStatus:1})
  }

  signIn = async () => {
    try {
      const response = await axios.post('http://192.168.0.107:3000/signin',
    {
      emailc:this.state.Email,
      passwordc: this.state.Password
    });

    const {namec , _id, typec, emailc} = response.data;

    this.setState({loggedInUser:namec})
    this.setState({typeUser:typec})

    await AsyncStorage.multiSet([
      ['@Api:token', JSON.stringify(_id)],
      ['@Api:user',JSON.stringify(namec)],
      ['@Api:typec',JSON.stringify(typec)],
      ['@Api:email', JSON.stringify(emailc)]

    ]);
    } catch (response) {
      this.setState({errorMessage:response.data.error})
    }
    this.setState({Name:''})
    this.setState({Password:''})
    this.setState({Email:''})

    Alert.alert(
      this.state.loggedInUser,
      'Login realizado com sucesso',
      [
        {
          text: 'Ok!',
          style: 'default'
        }
      ],
      { cancelable: false }
    );
  }

  confirmSignOut(){
    Alert.alert(
      'Logout',
      'Deseja realmente fazer logout?',
      [
        {
          text: 'Não',
          style: 'cancel'
        },
        { text: 'Sim', onPress: () => this.signOut() }
      ],
      { cancelable: false }
    );
  }
  signOut(){
    this.setState({loggedInUser:null})
    AsyncStorage.removeItem('@Api:user')
    AsyncStorage.removeItem('@Api:token')
    AsyncStorage.removeItem('@Api:typec')
    AsyncStorage.removeItem('@Api:email')
    this.setState({typeUser:null})
    this.setState({Name:''})
    this.setState({Password:''})
    this.setState({Email:''})
    this.setState({LoginStatus:0})
  }

  /*deleteData(id){
    Alert.alert('Item Exluido')

    fetch("http://192.168.0.107:3000/delete", {
      method:"post",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        _id:id
      })
    })
    .then(res=>res.json())
  }*/

  updateStatusDelivery(id){
    if (this.state.Status == 'Pendente') {
    fetch("http://192.168.0.107:3000/update", {
      method:"post",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        _id:id,
        statusc:'Concluido',
      })
    })
    .then(res=>res.json())
    this.setState({Status:'Concluido'})
  } else {
    fetch("http://192.168.0.107:3000/update", {
      method:"post",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        _id:id,
        statusc:'Pendente',
      })
    })
    .then(res=>res.json())
    this.setState({Status:'Pendente'})
  }
}

 /* USERS TYPES */
 deliveryLogged () {
  return (
    <View style={{alignItems:'center'}}>
    <View style={{backgroundColor:'tomato',flexDirection:'row',borderBottomStartRadius:20, borderBottomEndRadius:20}}>
      <View style={{maxWidth:260}}>
      <Text style={{color: 'white', fontSize:18, alignSelf:'center', margin:15}}>
        Bem-vindo, {this.state.loggedInUser}
      </Text>
      </View>
    <View style={{alignSelf:'center'}}>
      <TouchableOpacity onPress={() => this.getData()}>
        <View style={{margin:15}}>
        <Icon name='cloud-download-outline' size={24} color='white' />
        </View>
      </TouchableOpacity>
      </View>
      <View style={{alignSelf:'center', marginRight:5}}>
      <TouchableOpacity onPress={()=>this.confirmSignOut()}>
        <View style={{margin:15}}>
        <Icon name='exit-outline' size={24} color='white' />
        </View>
      </TouchableOpacity>
    </View>
    </View>
      <Text>Cadastre aqui os itens que serão vendidos</Text>
      <View style={{flexDirection:'row'}}>
      {/*<CheckBox
              disabled={false}
              value={this.state.toggleCheckBox}
              onValueChange={(toggleCheckBox) => {this.setState({toggleCheckBox})}}/>*/}
          <TextInput
           placeholder={'Nome do Item'}
           onChangeText={Product => {this.setState({ Product })}}
           value={this.state.Product}/>
           </View>
            <Button
            title="Enviar"
            onPress={this.submitData}/>
             {this.state.Dados.map(data=>(
             <View key={data._id}>
             <TouchableOpacity onPress={() => this.updateStatusDelivery(data._id)}>
             <View style={{height: 50,backgroundColor:'tomato',flexDirection:'row'}}>
             <View>
             <Text style={{alignItems:'flex-start',color:'white'}}>{data.productc}  </Text>
             </View>
             <View>
             <Text style={{alignItems:'flex-end', color:'white'}}>{data.statusc}</Text>
             </View>
             </View>
             </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

  adminLogged () {
    return (
      <View style={{alignItems:'center'}}>
      <View style={{backgroundColor:'tomato',flexDirection:'row'}}>
        <View>
        <Text style={{color: 'white', fontSize:18, alignSelf:'center', margin:15}}>
          Bem-vindo, {this.state.loggedInUser}
        </Text>
        </View>
      <View>
        <TouchableOpacity onPress={() => this.getData()}>
          <View style={{margin:15}}>
          <Icon name='cloud-download-outline' size={22} color='white' />
          </View>
        </TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity onPress={()=>this.confirmSignOut()}>
          <View style={{margin:15}}>
          <Icon name='exit-outline' size={22} color='white' />
          </View>
        </TouchableOpacity>
      </View>
      </View>
        <Text>Cadastre aqui os itens que serão vendidos</Text>
        <View style={{flexDirection:'row'}}>
        {/*<CheckBox
                disabled={false}
                value={this.state.toggleCheckBox}
                onValueChange={(toggleCheckBox) => {this.setState({toggleCheckBox})}}/>*/}
            <TextInput
             placeholder={'Nome do Item'}
             onChangeText={Product => {this.setState({ Product })}}
             value={this.state.Product}/>
             </View>
              <Button
              title="Enviar"
              onPress={this.submitData}/>
               {this.state.Dados.map(data=>(
               <View key={data._id}>
                 <TouchableOpacity onPress={() => this.updateStatusDelivery(data._id)}>
                 <View style={{height: 50,backgroundColor:'#864425',flexDirection:'row'}}>
               <Text style={{alignItems:'flex-start'}}>{data.productc}  </Text>
               <Text style={{alignItems:'flex-end'}}>{data.statusc}</Text>
               </View>
               </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }
 
  inputForLogin() {
    return (
      <KeyboardAvoidingView>
        <TextInput
        style={styles.textInput}
        placeholder={'Email'}
        placeholderTextColor={'white'}
        onChangeText={Email => {this.setState({ Email })}}
        value={this.state.Email}/>
        <TextInput
        style={styles.textInput}
        placeholder={'Senha'}
        placeholderTextColor={'white'}
        onChangeText={Password => {this.setState({ Password })}}
        value={this.state.Password}/>
        <TouchableOpacity onPress={this.signIn}>
          <View style={styles.button}>
            <Text style={{color:'white', fontSize:18, marginRight:10, marginLeft:30}}>
              Entrar
            </Text>
            <Icon name='arrow-forward-circle-outline' size={22} color='white' />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>this.loginStatusExit()}>
          <View style={styles.button}>
          <Icon name='arrow-back-circle-outline' size={22} color='white' />
            <Text style={{color:'white', fontSize:18, marginLeft:10, marginRight:30}}>
              Voltar
            </Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }

  loginStatusEnter() {
    this.setState({LoginStatus:1})
  }

  loginStatusExit() {
    this.setState({LoginStatus:0})
  }

  inputForSignIn() {
    return (
      <KeyboardAvoidingView>
      <TextInput
      style={styles.textInput}
      placeholderTextColor={'white'}
      placeholder={'Nome Completo'}
      onChangeText={Name => {this.setState({ Name })}}
      value={this.state.Name}/>
      <TextInput
      style={styles.textInput}
      placeholder={'Email'}
      placeholderTextColor={'white'}
      onChangeText={Email => {this.setState({ Email })}}
      value={this.state.Email}/>
      <TextInput
      style={styles.textInput}
      placeholder={'Senha'}
      placeholderTextColor={'white'}
      onChangeText={Password => {this.setState({ Password })}}
      value={this.state.Password}/>
      <TouchableOpacity onPress={()=>this.cadastroLogin()}>
        <View style={styles.button}>
          <Text style={{color:'white', fontSize:18, marginRight:10, marginLeft:30}}>
            Cadastrar
          </Text>
          <Icon name='arrow-forward-circle-outline' size={22} color='white' />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>this.signinStatusExit()}>
        <View style={styles.button}>
        <Icon name='arrow-back-circle-outline' size={22} color='white' />
          <Text style={{color:'white', fontSize:18, marginLeft:10, marginRight:30}}>
            Voltar
          </Text>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
    )
  }

  signinStatusEnter() {
    this.setState({SignInStatus:1})
  }

  signinStatusExit() {
    this.setState({SignInStatus:0})
  }

  notLogged() {
    return (
      <View>
        { this.state.LoginStatus == 0 && this.state.SignInStatus == 0 && 
        <View>
        <TouchableOpacity onPress={() => this.loginStatusEnter()}>
          <View style={{ backgroundColor: 'tomato',alignItems: 'center',justifyContent: 'center',
                         borderRadius: 15,marginHorizontal:40,marginTop:100,padding:10}}>
            <Text style={{color:'white', fontSize:18}}>
              Entrar
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.signinStatusEnter()}>
          <View style={styles.button}>
            <Text style={{color:'white', fontSize:18}}>
              Cadastrar
            </Text>
          </View>
        </TouchableOpacity>
        </View>
       }

       { this.state.LoginStatus == 1 && 
         <View>
           {this.inputForLogin()}
         </View>
      }

      { this.state.SignInStatus == 1 && 
         <View>
           {this.inputForSignIn()}
         </View> 
      }
      </View>
    )
  }

  render() { 
    return (
      <View>
        {!this.state.loggedInUser && 
          <View style={{alignItems:'center'}}>
          <Image style={styles.viewImage} resizeMode="contain" source={require("./src/foodapp(1).png")}  />
          </View>}
        {!this.state.loggedInUser && <View>{this.notLogged()}</View>}
        {this.state.typeUser == 1 && <View>{this.deliveryLogged()}</View>}
        {this.state.typeUser == 2 && <View>{this.adminLogged()}</View>}
      </View>
    )
}
}

const styles = StyleSheet.create({
  viewImage: {
    height:70,
    marginTop:140
  },
  textInput: {
    backgroundColor:'tomato',
    color:'white',
    borderRadius:15,
    textAlign:'center',
    marginHorizontal:40,
    marginBottom:5,
    fontSize:16
  },
  button: {
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginHorizontal:40,
    marginTop:30,
    padding:10,
    flexDirection:'row'
  },
  textProd: {

  }
});