import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Avatar, Card, Container, Heading } from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { auth } from '../../Firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUser } from '../../Firebase/firebaseSlice';
import {storage} from '../../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Row } from 'gestalt';
import { Column } from 'gestalt';


const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { displayName, photoURL, email } = user;
  const [data, setData] = useState([]);
  const [image, setImage] = useState('');
  const [imageTab, setImageTab] = useState([]);

  const allInputs = {imgUrl: ''}
    const [imageAsFile, setImageAsFile] = useState('')
    const [imageAsUrl, setImageAsUrl] = useState(allInputs)
    if(imageAsFile === '' ) {
      console.error(`not an image, the image file is a ${typeof(imageAsFile)}`)
    }
    const handleImageAsFile = (e) => {
      const image = e.target.files[0]
      setImageAsFile(imageFile => (image))
  }
    const handleFireBaseUpload = e => {
      e.preventDefault()
    console.log('start of upload')
    // async magic goes here...
    if(imageAsFile === '') {
      console.error(`not an image, the image file is a ${typeof(imageAsFile)}`)
      alert("please select image")
      return true
    }
    const nameImg = uuidv4()+imageAsFile.name
    const uploadTask = storage.ref(`/images/${nameImg}`).put(imageAsFile)
    //initiates the firebase side uploading 
    uploadTask.on('state_changed', 
    (snapShot) => {
      //takes a snap shot of the process as it is happening
      console.log(snapShot)
    }, (err) => {
      //catches the errors
      console.log(err)
    }, () => {
      // gets the functions from storage refences the image storage in firebase by the children
      // gets the download url then sets the image from firebase as the value for the imgUrl key:
      storage.ref('images').child(nameImg).getDownloadURL()
       .then(fireBaseUrl => {
         setImageAsUrl(prevObject => ({...prevObject, imgUrl: fireBaseUrl}))
         listItem()
       })
    })
    }
    useEffect(() => {
     listItem()
    }, []);
    const listItem = async() => {
     await storage.ref().child('images/').listAll()
     .then(function(result) {
      result.items.forEach(function(imageRef) {
          imageRef.getDownloadURL().then(function(url) {
              setData(arr => [...arr, url]);
          }).catch(function(error) {
              // Handle any errors
              console.log('got error',error)
          });
      });
  })
  .catch((e) => console.log('Errors while downloading => ', e));
        // .then(res => {
        //   res.items.forEach((item) => {
        //     setData(arr => [...arr, item.name]);
        //   })

        // })
        // .catch(err => {
        //   alert(err.message);
        // })
    }


  return (
    <Box padding={3}>
      <Container>
        <Box padding={3}>
          <Heading size="md">Profile</Heading>
        </Box>
        <Box maxWidth={200} padding={20} column={8}>
          <Row>
            <Column >
            <Card image={<Avatar name="James Jones" src={photoURL} />}>
            <Text align="center" weight="bold">
              <Box paddingX={3} paddingY={2}>
                {displayName}
              </Box>
            </Text>
            <Text align="center">
              <Box paddingX={3} paddingY={2}>
                {email}
              </Box>
            </Text>
            <Button
              onClick={() => {
                auth.signOut();
                dispatch(setUser(null));
              }}
              accessibilityLabel="Sign out of your account"
              color="red"
              text="Sign out"
            />
          </Card>
            </Column>
            
            <Column>
                <Card>
                  <Column>
                  <form onSubmit={handleFireBaseUpload}>
                    <h2>Uploade Image</h2>
                        <input 
                // allows you to reach into your file directory and upload image to the browser
                          type="file"
                          onChange={handleImageAsFile}
                        />
                        <button>upload</button>
                  </form>
                  </Column>
              </Card>
            </Column>
          </Row>
          
          
        </Box>

        <Row>
          <Column>
          
          {
          data.map((val) => (
            <Box maxWidth={100} padding={2} column={6}>
              <img src={val}  width="200" height="200"/>
            </Box>
          ))
        }
          </Column>
          
        </Row>
      </Container>
      
    </Box>
  );
};
export default ProfilePage;
