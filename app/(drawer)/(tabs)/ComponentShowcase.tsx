import React, { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function ComponentShowcase() {
  const [isSummoned, setIsSummoned] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Add Title Here */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>Cantarella</ThemedText>
      </ThemedView>

      <ThemedView style={styles.headerContainer}>
        <Image
          source={require('@/assets/images/IMG_0708.png')}
          style={styles.cantarellaImage}
        />
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">About Cantarella 🌊</ThemedText>
        <Text style={styles.text}>
          Cantarella is a cute 5-star Havoc Resonator with deep ocean eyes! She’s the 36th Fisalia matriarch and loves jellyfish dreams. 🪸
        </Text>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Play with Cantarella! 🎮</ThemedText>
        <Button
          title="Summon Her!"
          onPress={() => setIsSummoned(!isSummoned)}
          color="#6A5ACD"
        />
        {isSummoned && (
          <ThemedView style={styles.summonContainer}>
            <Image
              source={require('@/assets/images/IMG_0706.png')}
              style={styles.summonImage}
            />
            <Text style={styles.summonText}>Yay! Cantarella joins your team! 🎉</Text>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Cantarella’s Look! 👗</ThemedText>
        <Image
          source={require('@/assets/images/cantarella.jpg')}
          style={styles.cantarella}
        />
        <Text style={styles.text}>So elegant with lavender hair! 💜</Text>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginTop: 50,
    marginVertical:10
  },
  titleText: {
      padding: 10,
    fontSize: 36,
    color: '#6A5ACD',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  sectionContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 2,
  },
  text: {
    fontSize: 20,
    color: '#4A4A4A',
    textAlign: 'center',
  },
  cantarellaImage: {
    width: 400,
    height: 230,
    marginVertical: 10,
    borderRadius: 10,
  },
  cantarella: {
    width: 400,
    height: 250,
    marginVertical: 10,
    borderRadius: 10,
  },
  reactlogo: {
    width: 150,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  summonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  summonImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 5,
  },
  summonText: {
    fontSize: 16,
    color: '#6A5ACD',
    textAlign: 'center',
    marginTop: 5,
  },
});