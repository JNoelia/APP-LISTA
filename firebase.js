$(document).ready(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyD9slsvBByMNRuMhd3NyrH64fs6BiYJBWA",
    authDomain: "login-2e085.firebaseapp.com",
    projectId: "login-2e085",
    storageBucket: "login-2e085.appspot.com",
    messagingSenderId: "459262184948",
    appId: "1:459262184948:web:b7eefd5044a5ad50fb3da1",
    measurementId: "G-MJSWVQCS7R"
  };

  // No olvidar poner el => Firebase. (antes de "initializeApp")
  const app = firebase.initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const auth = firebase.auth();

  const db = firebase.firestore();

  var provider = new firebase.auth.GoogleAuthProvider();

  // REGISTRAR USUARIOS NUEVOS ;)

  // X CORREO Y CONTRASEÑA
  $("#registrate").click(function () {

    let nombre = $("#Nombre").val();
    let email = $("#Email").val();
    let password = $("#Password").val();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;

        // alerta de confirmacion:
        Swal.fire(
          'Listo!',
          'Su cuenta a sido creada con éxito',
        )
        // Demorar  la redireccion 
        function alInicio() {
          window.location.href = "index.html";
        }
        setTimeout(alInicio, 1000);

        addNombre(nombre);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage, errorCode
        })
      });
  });

  // X CUENTA DE GOOGLE
  $("#google").click(function () {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        alert("iniciaste con google");
        window.location.href = "home.html";
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage, errorCode, email, credential
        })
      });
  });

  // X CUENTA FACEBOOK
  $("#facebook").click(function () {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        // IdP data available in result.additionalUserInfo.profile.
        // ...

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;
        // ...
      })

      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
  })

  // INGRESAR CON CUENTA ;)

  //https://firebase.google.com/docs/auth/web/manage-users?hl=es&authuser=0

  //X CUENTA REGISTRADA ;)
  $("#ingresar").click(function () {
    let email = $("#Email1").val();
    let password = $("#Password1").val();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
        location.href = "pagina.html";
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage, errorCode
        })

      });
  })


  // CERRAR SESION ;)
  // X BOTON cerrar sesion
  $("#salir").click(function () {
    firebase
      .auth()
      .signOut()
      .then(() => {

        location.href = "index.html";
      })
      .catch((error) => {
        // An error happened.
      });
  })



  //AÑADIR NOMBRE ;)
  function addNombre(nombre) {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: nombre,
      // photoURL: "https://example.com/jane-q-user/profile.jpg"

    }).then(() => {
      // Update successful

      // ...
    }).catch((error) => {
      // An error occurred
      // ...
    });
  };


  // Mostrar usuario con sesión activa
  firebase.auth().onAuthStateChanged((user) => {
    window.location.reload;
    if (user) {

      // Los  var fueron creados   
      var uid = user.uid;
      var email = user.email;
      var usuario = user.displayName;

      // console.log(uid, email, usuario);
      obtenerDatos()
      infoUser();
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  //FUNCIONES
  function obtenerDatos() {
    db.collection("posteos").get().then((querySnapshot) => {
      mostrarDatos(querySnapshot.docs);
    });

  }

  function actualizarDato(id) {
    db.collection("posteos").doc(id).get().then((doc) => {
      //Si exite el post se mostara en el form
      let post = doc.data();

    });
  }
  // PUBLICACIONES

  // CREAR PUBLICACIONES
  $("#publicar").click(function (e) {
    e.preventDefault();
    let post = $("#texto").val();
    console.log(post);

    const user = firebase.auth().currentUser;

    console.log(user.uid, user.displayName);
    
    db.collection("Publicaciones").add({

      _publicacion: post,
      _idUser: user.uid,
        _nombreUser: user.displayName,
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.error("Error adding document: ",errorCode, errorMessage);
      });
  });


  //MOSTRAR PUBLICACION EN HTML
  function mostrarDatos(data) {
    const user = firebase.auth().currentUser;
    if (data.length > 0) {
      $("#post").empty();
      let html = "";

      data.forEach((doc) => {
        var post = doc.data();
        console.log("Publicacion hecha", post);

        var div = ``;
        if (user.uid == post._idUser) {
          div = `
          <div class="card" style="max-width: 800px;">
          <div class="card-body">
            <p>${post._publicacion}</p>
            <p>Publicado por ${post._nombreUser}</p>
            <button class="btn btn-primary" data-id="${doc._idUser}">
              Editar
            </button>
            <button class="btn  btn-danger" data-id="${doc._idUser}">
              Eliminar
            </button>
          </div>
        </div>
        `;
        } else {
          div = `
          <div class="card bg-dark text-white " style="max-width: 800px;">
            <div class="card-body">
              <p>${post._publicacion}</p>
              <p>Publicado por ${post._nombreUser}</p>
            </div>
          </div>
        `;
        }

        html += div;
      });
      $("#post").append(html);

    }
  }



  // MOSTRAR INFORMACION DEL USUARIO
  function infoUser() {

    const user = firebase.auth().currentUser;
    console.log("TODO USUARIO", user);
    var html = "";

    if (user !== null) {
      var displayName = user.displayName;
      var email = user.email;
      var fotoURL = "";

      if (user.photoURL != null) {
        fotoURL = user.photoURL;
      } else {
        fotoURL = "https://i.pinimg.com/originals/7f/06/89/7f0689ae6a6792d2860379cc55387245.gif";
      }

      html = `
      <div class="card-body">
      <img class="object-fit-cover border rounded" height="90px" id="userPhoto" src="${fotoURL}">
      <div>
          <hr>
          <h3>${displayName}</h3>
          <h4>${email}</h4>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam facere exercitationem doloribus
              necessitatibus porro ea in dolor, voluptates suscipit expedita nam accusantium unde saepe dolorum
              deserunt harum vel praesentium. Nobis.</p>

      </div>
  </div>
    `;
      $("#userInfo").append(html);
    } else {
      console.log("error SOS");
    }
  }
});

  // Actualizar nombre por opciones

  // $("#actualizar_nombre").click(function () {
  //   alert("hola");
  // let usuario = $("#Nombre").val();
  //   const user = firebase.auth().currentUser;

  // user.updateProfile({
  //   displayName: usuario,
  //   // photoURL: "https://example.com/jane-q-user/profile.jpg"

  // }).then(() => {
  //   // Update successful
 //EDITAR PARA Q APAREZCA UN FORMULARIO
  // Swal.fire({
  //   title: 'Custom animation with Animate.css',
  //   showClass: {
  //     popup: 'animate__animated animate__fadeInDown'
  //   },
  //   hideClass: {
  //     popup: 'animate__animated animate__fadeOutUp'
  //   }
  // })


  //   // ...
  // }).catch((error) => {
  //   // An error occurred
  //   // ...
  // });









