package com.example.brigade;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WebController {

    @RequestMapping("/")
	public @ResponseBody String greeting() {
		return "Hello, World";
	}
    
}
