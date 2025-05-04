import { Image, StyleSheet, Platform, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const locations = [
    { label: 'Movie Montevideo', value: 'Movie Montevideo' },
    { label: 'Movie Punta Carretas', value: 'Movie Punta Carretas' },
    { label: 'Movie Portones', value: 'Movie Portones' },
    { label: 'Movie Nuevocentro', value: 'Movie Nuevocentro' }
  ];

  type Movie = {
    movie: string;
    description: string;
    genre: string;
    posterURL: string;
    trailerURL: string;
    cinemaShows: CinemaShow[];
  };

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

  const [location, setLocation] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  const filterMovies = (newLocation: string) => {
    if (!movies) return;

    let filtering = movies.filter(movie =>
      movie.cinemaShows.some(show => show.cinema.includes(newLocation))
    );

    setFilteredMovies(filtering);
    console.log(filtering.length);
  };

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.movie.com.uy/api/shows/rss/data');
      const json = await response.json();
      console.log('Datos recibidos:', json);
      let movies = json.contentCinemaShows;
      setMovies(movies);
    } catch (error) {
      console.error('Error al obtener los datos del webservice:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo_movie_mobile.png')}
            style={styles.movieLogo}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            data={locations}
            labelField="label"
            valueField="value"
            value={location}
            placeholder='Seleccione un complejo'
            onChange={item => {
              setLocation(item.value);
              filterMovies(item.value)
            }}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
          />
        </View>
        {filteredMovies.length > 0 &&
          <View>
            {filteredMovies.map((movie: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  router.push({
                    pathname: '/movie',
                    params: {
                      id: index.toString(),
                      title: movie.movie,
                      description: movie.description,
                      genre: movie.genre,
                      posterURL: movie.posterURL,
                      trailerURL: movie.trailerURL,
                      cinemaShows: JSON.stringify(movie.cinemaShows)
                    },
                  })
                }
                style={styles.posterContainer}
              >
                <Text style={styles.movieTitle}>{movie.movie}</Text>
                <Image source={{ uri: movie.posterURL }} style={styles.poster} />
              </TouchableOpacity>
            ))}
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundBlack
  },
  logoContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  movieLogo: {
    width: 50,
    height: 50,

  },
  dropdownContainer: {
    paddingHorizontal: 15,
    marginTop: 30,
    marginBottom: 20
  },
  dropdown: {
    height: 50,
    borderColor: Colors.moviePink,
    backgroundColor: Colors.darkBlack,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: Colors.moviePink
  },

  placeholderStyle: {
    color: Colors.moviePink,
    fontSize: 16,
  },
  selectedTextStyle: {
    color: Colors.moviePink,
    fontSize: 16,
  },
  posterContainer: {
    alignItems: 'center'
  },
  poster: {
    width: 200,
    height: 300
  },
  movieTitle: {
    color: Colors.white,
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 25
  }
});
