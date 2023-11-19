import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import Logo from './components/Logo';
import bgimg from "../project/assets/image/homescreen.png";

export default function App() {
  const viewShotRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [quotes, setQuotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [quoteBackgroundColor, setQuoteBackgroundColor] = useState('lightblue'); // Default color

  const quotesHandler = async () => {
    try {
      const response = await fetch('https://dummyjson.com/quotes/random');
      const data = await response.json();
      setQuotes(data.quote);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const captureView = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'jpg',
        quality: 0.9,
      });
      setCapturedImage(uri);
    } catch (error) {
      console.error('Error capturing view:', error);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    quotesHandler();
    setCapturedImage(null);

    // Generate a random background color on refresh
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setQuoteBackgroundColor(randomColor);
  };

  const handleShare = async () => {
    if (capturedImage) {
      try {
        await Sharing.shareAsync(capturedImage);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    quotesHandler();
  }, []);

  return (
    <ImageBackground source={bgimg} style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* Logo view styled at the top left */}
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <View style={styles.card}>
        <Text style={styles.labelText}>Quote of the Day</Text>
        <View ref={viewShotRef} style={[styles.captureView, { backgroundColor: quoteBackgroundColor }]}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text style={styles.quoteText}>{quotes}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.captureButton} onPress={captureView}>
        <Text style={styles.buttonText}>Capture View</Text>
      </TouchableOpacity>

      {capturedImage && (
        <View style={styles.capturedImageContainer}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 30,
    left: 5,
    padding: 10,
    zIndex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 20,
  },
  captureView: {
    backgroundColor: 'lightblue',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  quoteText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  captureButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  capturedImageContainer: {
    alignItems: 'center',
  },
  capturedImage: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
});
