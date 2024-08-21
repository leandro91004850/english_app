# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


* Rodando o projeto:
    ```bash
        $ npx expo start
    ```

* Rodando o projeto no modo clear cache:
    ```bash
        $ npx expo start --clear
    ```

* rodar modo externo da rede:
    ```bash
        $ npx expo start --tunnel
    ```  


* Instalando font family roboto:
    ```bash
        $ npx expo install expo-font @expo-google-fonts/roboto
    ```

* Instalando o gestor handle: https://docs.expo.dev/versions/latest/sdk/gesture-handler/
    ```bash
        $ npx expo install react-native-gesture-handler
    ```

    ## Atualizando a versão de expo em projetos antigos:

Caso você tenha um projeto antigo e deseja atualizar a versão do expo, siga os passos abaixo:

1. Instale a versão mais recente do expo:
    ```bash
        $ npm install expo@latest
    ```
2. Atualize o expo e todas as dependências:
    ```bash
        $ npx expo install --fix
    ```
3. verificar se existe problema nas dependências:
    ```bash
        $ npx expo-doctor
    ```

    ## Permitir leitura e escrita de arquivos:
    
        ```bash
            $ chmod 666 nome_do_arquivo
        ```

### usando o figma como ferramenta de design: [Figma design app](https://www.figma.com/community/file/1155362909441341285/)

#### Gerando APK expo go:
    ```bash
       eas build -p android --profile preview
    ```

### Intalando o handle gesture:
    ```bash
        $ npx expo install react-native-gesture-handler
    ```
        
### Instalar react native reanimated para funcionar moti:https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/

    ```bash
        npx expo install react-native-reanimated
    ```

