# FoodAppDelivery
O app tem como objetivo ter as funções de um aplicativo delivery (como o ifood) de forma única, sem precisar de um app para o delivery, outro app para o restaurante e outro app para administradores, tudo no mesmo app.<br>
OBS:*A aplicação ainda está em desenvolvimento, por isso o frontend ainda está incompleto.*

# Como rodar o app?
# Dependências:
É preciso ter já ter instalado npm ou yarn, nodejs, androidstudio, react-native,  Python, JDK8, Git.
# 1° Criando o projeto:
Execute os comandos abaixo.<br>
Instala a ferramenta de criação automatizada do React-Native:<br>
*npm install -g create-react-native-app*

Abra a pasta diretório que deseja criar o projeto:<br>
*cd ProjetoReact/*

Crie o projeto:<br>
*create-react-native-app FoodAppDelivery*

Instale o React-Native-Cli:<br>
*npm install -g react-native-cli*

Download dos arquivos:<br>
*git clone https://github.com/dev-MarcosVinicius/FoodAppDelivery.git*

# 2° Rodando o Backend:<br>
Entre no diretório mobile/server:<br>
*cd server/*

Instale os node_modules e as dependências:<br>
*npm install && npm install -g nodemon*<br>

Execute o servidor:<br>
*nodemon app*

OBS: você precisa ver no console a mensagem "conectado ao mongoDB" se não aparecer não foi possivel realizar a conexão com o DB, Veja o arquivo server/app.js para configura-lo.

# 3° Rodando o Frontend:<br>
Em um novo terminal no diretório mobile/ execute:<br>
*react-native start*

Abra outro terminal no mesmo diretório e execute:<br>
*react-native run-android* ou *react-native run-ios*

O bundle será compilado e carregado no seu emulador ou no seu dispositivo conectado.
