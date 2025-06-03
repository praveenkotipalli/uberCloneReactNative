import { useUser } from "@clerk/clerk-expo";
import { Image, Text, View } from "react-native";
import { useDriverStore, useLocationStore } from "../../store";
import { formatTime } from "../../components/util";
import RideLayout from "../../components/RideLayout";
import { icons } from "../../constants";
import tw from 'twrnc';
import Payment from "../../components/Payment";

const BookRide = () => {
  const { user } = useUser();
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.find(
    (driver) => +driver.id === selectedDriver
  );

  return (
    <RideLayout title="Book Ride" >
      <>
      <Text style={tw`text-xl font-semibold mb-`}>
          Ride Information
        </Text>

        {/* Driver Profile */}
        <View style={tw`items-center justify-center w-full mt-2`}>
          <Image
            source={{ uri: driverDetails?.profile_image_url }}
            style={tw`w-25 h-25 rounded-full shadow-lg`}
          />

          <Text style={tw`text-xl font-semibold mt-2 text-gray-900`}>
            {driverDetails?.title}
          </Text>

          <View style={tw`flex-row items-center space-x-1`}>
            <Image source={icons.star} style={tw`w-5 h-5`} resizeMode="contain" />
            <Text style={tw`text-lg font-medium text-yellow-500`}>
              {driverDetails?.rating}
            </Text>
          </View>
        </View>

        {/* Ride Details Card */}
        <View style={tw`flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-gray-800 mt-1`}>
          <View style={tw`flex flex-row items-center justify-between w-full border-b border-white py-3`}>
            <Text style={tw`text-lg font-normal text-white`}>Ride Price</Text>
            <Text style={tw`text-lg font-normal text-[#0CC25F]`}>
              ${driverDetails?.price}
            </Text>
          </View>

          <View style={tw`flex flex-row items-center justify-between w-full border-b border-white py-3`}>
            <Text style={tw`text-lg font-normal text-white`}>Pickup Time</Text>
            <Text style={tw`text-lg font-normal text-white`}>
              {formatTime(driverDetails?.time || 5)}
            </Text>
          </View>

          <View style={tw`flex flex-row items-center justify-between w-full py-3`}>
            <Text style={tw`text-lg font-normal text-white`}>Car Seats</Text>
            <Text style={tw`text-lg font-normal text-white`}>
              {driverDetails?.car_seats}
            </Text>
          </View>
        </View>

        {/* Route Details */}
        {/* Route Details */}
<View style={tw`w-full mt-5 bg-white p-5 rounded-2xl shadow-md`}>
  <View style={tw`flex-row`}>
    {/* Icons and connecting line */}
    <View style={tw`items-center mr-4`}>
      <Image source={icons.to} style={tw`w-5 h-5`} />
      <View style={tw`w-0.5 bg-gray-300 h-6 my-1`} />
      <Image source={icons.point} style={tw`w-5 h-5`} />
    </View>

    {/* Addresses */}
    <View style={tw`flex-1`}>
      <View>
        <Text style={tw`text-sm text-gray-500 mb-1`}>Pickup Location</Text>
        <Text style={tw`text-base font-medium text-gray-800`}>
          {userAddress}
        </Text>
      </View>

      <View style={tw`mt-4 mb-4`}>
        <Text style={tw`text-sm text-gray-500 mb-1`}>Destination</Text>
        <Text style={tw`text-base font-medium text-gray-800`}>
          {destinationAddress}
        </Text>
      </View>
    </View>
  </View>
  <Payment />
</View>

      </>
    </RideLayout>
  );
};

export default BookRide;
