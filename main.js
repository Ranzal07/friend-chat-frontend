// Imported Modules
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path');
const axios = require("axios");
const dotenv = require('dotenv').config();

// Global Variables
const isDev = false;

const isMac = process.platform === 'darwin';

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
        {
          label: 'App Logs',
          click: logsWindow
        },
        {
            label: 'About',
            click: aboutWindow,
        },
        isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
        { role: 'minimize' },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
    ]
  },
]

// Application Logs Window
function logsWindow () {
  const logs = new BrowserWindow({
    width: 900,
    height: 600,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  logs.setMenuBarVisibility(false);

  if (isDev) {
    logs.webContents.openDevTools();
  }

  logs.loadFile(path.join(__dirname, "./renderer/logs.html"));
}

// About Window
function aboutWindow () {
  const about = new BrowserWindow({
    width: 400,
    height: 400,
    alwaysOnTop: true,
  });

  about.setMenuBarVisibility(false);

  about.loadFile(path.join(__dirname, "./renderer/about.html"));
}

// Main Window
const createWindow = () => {
    const main = new BrowserWindow({
        width: isDev ? 1200 : 600,
        height: 600,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    })

        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)

    if (isDev) {
        main.webContents.openDevTools();
    }

    main.loadFile(path.join(__dirname, './renderer/index.html'));
}

function aboutWindow() {
    const about = new BrowserWindow({
        width: 400,
        height: 400,
        alwaysOnTop: true,
    })

    about.setMenuBarVisibility(false);

    about.loadFile(path.join(__dirname, './renderer/about.html'));
}

app.whenReady().then(() => {
    // initialize functions
    ipcMain.handle('axios.openAI', openAI);
    ipcMain.handle('axios.supaBase', supaBase);

    // Create Main Window
    createWindow();

    // Start Window
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
        }
    })
})

// Close Window
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// function for connecting to OpenAI API
async function openAI(event, messageValue, toolType){
    let result = null;
    const env = dotenv.parsed;
  
    await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        data: {
			model: "text-davinci-003",
			prompt: ( toolType == 'Friend Chat' ? "Friend:\n\n" : "Create a list of 8 questions for my interview with a science fiction author:\n\n" ) +  messageValue,
			temperature: ( toolType == 'Friend Chat' ? 0 : 0.7 ),
			max_tokens: ( toolType == 'Friend Chat' ? 60 : 64 ),
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + env.OPENAI_KEY
        }
    }).then(function (response) {
        result = response.data;
    })
    .catch(function (error) {
        result = error.response.data;
    });
  
    return result;
}

// function for connecting to Supabase API
async function supaBase(event, method, id = '', data = ''){
    let result = null;
    const env = dotenv.parsed;
    let query = ( method == 'get' ? '?select=*' : (method == 'delete' ? '?prompt_id=eq.' + id : '') );
  
    await axios({
        method: method,
        url: 'https://hrzzmrlbaobrxffzhfmf.supabase.co/rest/v1/prompts' + query,
        headers: ( method == 'post' ? {
            'apikey': env.SUPABASE_KEY,
            'Authorization': 'Bearer ' + env.SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          } : {
            'apikey': env.SUPABASE_KEY,
            'Authorization': 'Bearer ' + env.SUPABASE_KEY 
          } ),
        data: ( method == 'post' ? data : null )
    }).then(function (response) {
        result = response.data;
    })
      .catch(function (error) {
        result = error.response.data;
    });
  
    return result;
}