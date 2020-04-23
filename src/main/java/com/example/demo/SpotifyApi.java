package com.example.demo;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.json.JsonParserFactory;

import okhttp3.*;

/**
 * Interface for communicating with the Spotify Api
 */
public class SpotifyApi {

  private final OkHttpClient httpClient = new OkHttpClient();
  private static SpotifyApi instance = new SpotifyApi();
  private String accessToken;

  /**
   * Private constructor to ensure single instance.
   */
  private SpotifyApi() {
    updateAccessToken();

    // Spotify access token expires every hour, refresh it
    Runnable accessTokenRunnable = new Runnable() {
      public void run(){
        updateAccessToken();
      }
    };
    ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
    executor.scheduleAtFixedRate(accessTokenRunnable, 1, 1, TimeUnit.HOURS);
  }

  /**
   * Sends Client Id and Client Secret to Spotify to obtain API access token.
   */
  private void updateAccessToken() {
    // get api access token
    String clientId = System.getenv("SpotifyClientId");
    System.out.println("client id: " + clientId);
    String clientSecret = System.getenv("SpotifyClientSecret");
    String idAndSecret = clientId + ":" + clientSecret;
    RequestBody formBody = new FormBody.Builder().add("grant_type", "client_credentials").build();
    Request request = new Request.Builder()
      .url("https://accounts.spotify.com/api/token")
      .addHeader("Authorization", "Basic " + Base64.getEncoder().encodeToString(idAndSecret.getBytes()))
      .post(formBody).build();
    try (Response response = httpClient.newCall(request).execute()) {
      if (!response.isSuccessful()){
        throw new IOException("Unexpected code " + response);
      }

      Map<String, Object> resMap = JsonParserFactory.getJsonParser().parseMap(response.body().string());
      accessToken = resMap.get("access_token").toString();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  /**
   * Accessor method for shared instance of SpotifyApi object.
   * @return Singleton instance of SpotifyApi object.
   */
  public static SpotifyApi getInstance() {
    return instance;
  }

  /**
   * Makes request to Spotify api and returns the json response.
   * @param query - search query
   * @param type - type of query (artist or track)
   * @param offset - offset of results for paging purposes
   * @return json response from Spotify Api to be handled client-side
   * @throws IOException
   */
  public String queryApi(String query, String type, String offset) throws IOException{
    HttpUrl url = new HttpUrl.Builder()
    .scheme("https")
    .host("api.spotify.com")
    .addPathSegment("v1")
    .addPathSegment("search")
    .addQueryParameter("q", query)
    .addQueryParameter("type", type)
    .addQueryParameter("offset", offset)
    .build();
    Request request = new Request.Builder()
      .url(url)
      .addHeader("Authorization", "Bearer " + accessToken)
      .build();
      try (Response response = httpClient.newCall(request).execute()) {
        if (!response.isSuccessful()){
          throw new IOException("Unexpected code " + response);
        }
  
        return response.body().string();
      }
  }
}