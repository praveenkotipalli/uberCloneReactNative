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

const OlaMapTextInput = ({
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

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchPlaces = async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
            query
          )}&api_key=Cm4hbnCsyffQSlWlVkNhroIHDjaXsXjIZotfvRdy`,
          {
            headers: {
              "X-Request-Id": Date.now().toString(), // generate unique ID per request
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (data && data.predictions) {
          setResults(data.predictions);
        } else {
          console.error("Unexpected response format:", JSON.stringify(data));
          setResults([]);
        }
      } catch (error) {
        console.error("Ola Maps error:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchPlaces, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

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
          paddingVertical: 1,
          marginHorizontal: 10,
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
            <Text style={{ fontSize: 18, color: "#888", paddingLeft: 10 }}>
              ×
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading indicator */}
      {loading && (
        <ActivityIndicator
          style={{ marginTop: 5 }}
          size="small"
          color="#888"
        />
      )}

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
            overflow: "hidden",
          }}
        >
          <FlatList
            data={results}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setQuery(item.description);
                  setResults([]);
                  handlePress({
                    address: item.description,
                    latitude: item.geometry?.location?.lat,
                    longitude: item.geometry?.location?.lng,
                  });
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  backgroundColor: "#fff",
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={{ fontSize: 14, color: "#444" }}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default OlaMapTextInput;
