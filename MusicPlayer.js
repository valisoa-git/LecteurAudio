import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  Event
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import podcasts from './assets/data';

function MusicPlayer() {
  


  const podcastsCount = podcasts.length;
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();
  
  const playBackState = usePlaybackState();
  const progress = useProgress();

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious
        ],
      });
      await TrackPlayer.add(podcasts);
      await gettrackdata();
      await TrackPlayer.play();
    } catch (error) { console.log(error); }
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artwork, artist} = track;
      console.log(event.nextTrack);
      setTrackIndex(event.nextTrack);
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });

  const gettrackdata = async () => {
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    console.log(trackIndex);
    setTrackIndex(trackIndex);
    setTrackTitle(trackObject.title);
    setTrackArtist(trackObject.artist);
    setTrackArtwork(trackObject.artwork);
  };

  const togglePlayBack = async playBackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    if (currentTrack !== null) {
      if (playBackState.state === "paused" || playBackState.state === "buffering") {
       
          await TrackPlayer.play();
        } else {
          console.log('playBackState === State.Ready:',playBackState);
          await TrackPlayer.pause();
        }
      }
    };

  const nexttrack = async () => {
    if (trackIndex < podcastsCount-1) {
      await TrackPlayer.skipToNext();
      gettrackdata();
    };
  };

  const previoustrack = async () => {
    if (trackIndex > 0) {
      await TrackPlayer.skipToPrevious();
      gettrackdata();
    };
  };

  const replay = async () => {
    await TrackPlayer.seekTo(0);
  };
  
  const forwardTrack = async () => {
    await TrackPlayer.seekTo((await TrackPlayer.getPosition()) + 30); 
  };
const backforward= async () => {
  await TrackPlayer.seekTo((await TrackPlayer.getPosition()) - 30); 
};
  useEffect(() => {
    setupPlayer();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.mainWrapper}>
          <Image source={trackArtwork} style={styles.imageWrapper} />
        </View>
        <View style={styles.songText}>
          <Text style={[styles.songContent, styles.songTitle]} numberOfLines={3}>{trackTitle}</Text>
          <Text style={[styles.songContent, styles.songArtist]} numberOfLines={2}>{trackArtist}</Text>
        </View>
      
        {/* Ajoutez les icônes de favori et de commentaire ici */}
        <View style={styles.topIconsContainer}>
          <TouchableOpacity onPress={() => { /* Gérer l'événement de l'icône de favori */ }}>
            <Ionicons name="heart-outline" size={30} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* Gérer l'événement de l'icône de commentaire */ }}>
            <Ionicons name="chatbox-ellipses-outline" size={30} color="#FFD369" />
          </TouchableOpacity>
        </View>
        <View>
          <Slider
            style={styles.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async value => await TrackPlayer.seekTo(value) }
          />
          <View style={styles.progressLevelDuraiton}>
            <Text style={styles.progressLabelText}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(3)}
            </Text>
            <Text style={styles.progressLabelText}>
              {new Date((progress.duration - progress.position) * 1000)
                .toLocaleTimeString()
                .substring(3)}
            </Text>
          </View>
        </View>
        <View style={styles.musicControlsContainer}>
        <TouchableOpacity onPress={replay}>
            <Ionicons 
              name="ios-refresh-circle" 
              size={35} 
              color="#FFD369" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={previoustrack}>
            <Ionicons 
              name="play-skip-back-outline" 
              size={35} 
              color="#FFD369" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={backforward}>
      
          <Ionicons name="play-skip-back" size={35} color="#FFD369" />
      
        </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayBack(playBackState) }>
            <Ionicons
              name={
                playBackState.state === 'playing'
                  ? 'ios-pause-circle'
                  : playBackState.state === 'loading'
                  ? 'ios-caret-down-circle'
                  : 'ios-play-circle'
              }
              size={75}
              color="#FFD369"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={forwardTrack}>
      
          <Ionicons name="play-skip-forward" size={35} color="#FFD369" />
      
        </TouchableOpacity>
          <TouchableOpacity onPress={nexttrack}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color="#FFD369"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 5,
    width: '100%',
  },
  mainWrapper: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    alignSelf: "center",
    width: '90%',
    height: '90%',
    borderRadius: 15,
  },
  songText: {
    marginTop:2,
    height: 70
  },
  songContent: {
    textAlign: 'center',
    color: '#EEEEEE',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 16,
    fontWeight: '300',
  },
  progressBar: {
    alignSelf: "stretch",
    marginTop: 10,
    marginLeft:5,
    marginRight:5
  },
  progressLevelDuraiton: {
    width: width,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#FFF',
  },
  musicControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '60%',
  },
});