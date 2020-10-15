package com.example.brigade;

import java.io.FileInputStream;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WebController {

    @RequestMapping("/")
	public @ResponseBody String greeting() {
		return "Hello, World";
	}

	@PostMapping("/student")
	public @ResponseBody String student(@RequestBody String name){


		return "student "+ name +" successful";
		
	}

	@GetMapping("/dbassertion")
  public ResponseEntity<String> asser() throws Exception {
    // logger.info("Uid {}",uid);

    try {
      new FileInputStream("D:/abc.txt").close();
      ;
    } catch (Exception e) {

      e.printStackTrace();
      throw e;
    }

    return new ResponseEntity<String>(String.format("UUID Notfound"), HttpStatus.NOT_FOUND);

  }
    
}
