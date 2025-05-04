import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { WebView } from 'react-native-webview';
import { useEffect } from 'react';


export default function MovieDetailScreen() {
  const { title, description, genre, posterURL, trailerURL, cinemaShows } = useLocalSearchParams();

  type CinemaShow = {
    cinema: string,
    shows: Show[]
  };

  type Show = {
    date: string,
    timeToDisplay: string,
    formatLang: string,
    screenName: string
  }

  let parsedCinemaShows: CinemaShow[] = [];

  try {
    parsedCinemaShows = JSON.parse(cinemaShows as string) as CinemaShow[];
    console.log("parsedCinemaShows: ", parsedCinemaShows);
  } catch (e) {
    console.warn('Error al parsear cinemaShows', e);
  }

  function convertToEmbedURL(url: string): string {
    const match = url.match(/v=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  }

  useEffect(() => {
    console.log("cinemaShows: ", cinemaShows);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Image source={{ uri: posterURL as string }} style={styles.poster} />
      <Text style={styles.genre}>{genre}</Text>
      <Text style={styles.description}>{description}</Text>
      {parsedCinemaShows &&
        parsedCinemaShows.map((cinema, idx) => (
          <View key={idx} style={styles.cinemaBlock}>
            <Text style={styles.cinemaTitle}>{cinema.cinema}</Text>
            <View style={styles.cardContainer}>
              {cinema.shows.map((show, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.cardTime}>{show.timeToDisplay}</Text>
                  <View style={styles.cardInfoRow}>
                    <Text style={styles.cardTag}>{show.formatLang}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      {trailerURL && (
        <View style={{ height: 200, width: '100%', marginTop: 20 }}>
          <WebView
            source={{ uri: convertToEmbedURL(trailerURL as string) }}
            style={{ flex: 1 }}
            javaScriptEnabled
            allowsFullscreenVideo
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.backgroundBlack,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    color: Colors.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  poster: {
    width: 200,
    height: 350,
    marginBottom: 20,
  },
  genre: {
    color: Colors.moviePink,
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'justify',
  },
  cinemaBlock: {
    marginTop: 10
  },
  cinemaTitle: {
    color: Colors.moviePink,
    fontSize: 20,
    marginBottom: 10,
  },
  cardTime: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  cardInfoRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  cardTag: {
    backgroundColor: '#333',
    color: '#ddd',
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    width: '48%',
  },
});
