package com.example.demo;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

/**
 * Routes search ajax request to SpotifyApi call
 */
@RestController
public class SpotifyController {

  /**
   * Sends request to spotify api and returns the json response
   * @param query - search query to send to spotify
   * @param type - type of query (artist or track name)
   * @param offset - offset for returned data for paging purposes
   * @return Json data from spotify response to be handled client-side
   * @throws IOException
   */
  @GetMapping("/search")
  public String search(@RequestParam(value = "query", defaultValue = "") String query, @RequestParam(value = "type", defaultValue = "") String type, @RequestParam(value = "offset", defaultValue = "0") String offset) throws IOException{
    if (query.equals("")) {
      throw new HttpClientErrorException(HttpStatus.UNPROCESSABLE_ENTITY, "Missing query.");
    }

    if (type.equals("")) {
      throw new HttpClientErrorException(HttpStatus.UNPROCESSABLE_ENTITY, "Missing query type.");
    }
    
    SpotifyApi api = SpotifyApi.getInstance();
    String queryResults = api.queryApi(query, type, offset);
    
    return queryResults;
  }


}