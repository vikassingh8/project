import { View, Image } from 'react-native'
import React from 'react'

const Logo = () => {
  return (
    <View>
       <Image
          source={require("../assets/image/avatar.png")}
          style={{
            width: 50,
            height: 50,
            borderRadius: 45,
            resizeMode: "cover",
          }}
        />
    </View>
  )
}

export default Logo