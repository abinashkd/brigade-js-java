package com.example.brigade;

import org.springframework.stereotype.Controller;
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
    
}
