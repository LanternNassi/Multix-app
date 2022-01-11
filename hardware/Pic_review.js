import React from 'react'
import { View , Image  } from 'react-native';

export default function Pic_review(props) {
    const { pic_url , height , width , } = props.route.params
    return (
        <View>
            <Image source = { { uri : pic_url }   } style = {{ height : height , width : width }} />
            
        </View>
    )
}
