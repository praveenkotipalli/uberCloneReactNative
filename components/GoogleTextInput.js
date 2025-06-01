import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { icons } from "../constants";

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputLayout, setInputLayout] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&addressdetails=1&limit=5`,
          {
            headers: {
              "User-Agent": "ReactNativeApp/1.0 (your@email.com)",
              Accept: "application/json",
            },
          }
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Nominatim error:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchPlaces, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={{ zIndex: 1000, position: "relative" }}>
      {/* Input Field */}
      <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  }}
  onLayout={(event) => {
    const layout = event.nativeEvent.layout;
    setInputLayout(layout);
  }}
>
  <Image
    source={icon ? icon : icons.search}
    style={{ width: 20, height: 20, marginRight: 10 }}
    resizeMode="contain"
  />
  <TextInput
    placeholder={initialLocation ?? "Where do you want to go?"}
    placeholderTextColor="#888"
    style={{
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
    }}
    value={query}
    onChangeText={setQuery}
  />
  {query.length > 0 && (
    <TouchableOpacity onPress={() => setQuery("")}>
      <Text style={{ fontSize: 18, color: "#888", paddingLeft: 10 }}>×</Text>
    </TouchableOpacity>
  )}
</View>


      {/* Floating Dropdown Results */}
      {inputLayout && results.length > 0 && (
        <View
        style={{
          position: "absolute",
          top: inputLayout.y + inputLayout.height + 8,
          left: 20,
          width: screenWidth - 40,
          backgroundColor: "#fff",
          borderRadius: 10,
          elevation: 6,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          maxHeight: 200,
          zIndex: 999,
          overflow: "hidden", // ensures all items are properly clipped
        }}
      >
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setQuery(item.display_name);
                setResults([]);
                handlePress({
                  address: item.display_name,
                  latitude: item.lat,
                  longitude: item.lon,
                });
              }}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 15,
                backgroundColor: "#fff", // important: ensures background for each item
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
              }}
            >
              <Text style={{ fontSize: 14, color: "#444" }}>
                {item.display_name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      )}
    </View>
  );
};

export default GoogleTextInput;
