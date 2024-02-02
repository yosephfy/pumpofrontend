import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { makeRequest } from "../../../axios";
import { AuthContext } from "../../context/AuthContext";
import { theme } from "../../core/theme";
import { apiCalls } from "../../utility/Enums";
import ProfilePicture from "../ProfilePicture";
import SingleComment from "./SingleComment";

export default function CommentContainer({ post, onPostComment }) {
  const { currentUser } = useContext(AuthContext);
  const [commentInput, setCommentInput] = useState();
  const writeBoxRef = useRef();

  const { error, isLoading, data, refetch } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () =>
      makeRequest.get(apiCalls(post.id).comment.get.fromPost).then((res) => {
        return res.data;
      }),
  });
  return (
    <>
      <View style={styles.writeCommentContainer}>
        <ProfilePicture picture={currentUser.profilePic} size={28} />
        <TextInput
          ref={writeBoxRef}
          id="commentInput"
          style={styles.input}
          numberOfLines={3}
          multiline
          textBreakStrategy="balanced"
          onChangeText={(newText) => setCommentInput(newText)}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => {
            onPostComment(commentInput, false, -1, refetch);
            writeBoxRef.current.clear();
          }}
        >
          <Ionicons name="paper-plane-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {error ? (
          <Text>Something went wrong..</Text>
        ) : isLoading ? (
          <Text>Loading...</Text>
        ) : (
          data.map((comment) => (
            <SingleComment key={comment.id} comment={comment} />
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    maxHeight: 400,
    marginBottom: 20,
  },
  writeCommentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginVertical: 10,
    gap: 10,
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceDisabled,
  },
  input: {
    backgroundColor: theme.colors.surface,
    flex: 1,
    minHeight: 40,
    borderRadius: 30,
    paddingLeft: 25,
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    overflow: "hidden",
    textAlign: "left",
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  userProfilePic: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  sendBtn: {
    position: "absolute",
    right: 17,
  },
});
