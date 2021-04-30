package com.cart.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CartController {
    @RequestMapping("/index")
    public String index(){
        return "index";
    }
    @RequestMapping("/product_01.html")
    public String product_01(){
        return "product_01";
    }
    @RequestMapping("/product_02.html")
    public String product_02(){
        return "product_02";
    }
}
