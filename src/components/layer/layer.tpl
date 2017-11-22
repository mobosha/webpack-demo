<div class="layer">
    <img src="${ require('../../assets/b.jpg') }" />
    <div> this is <%= name %> layer</div>
    <!--下边是 ejs模板 模板引擎写法-->
    <% for (var i = 0;i < arr.length; i++) {%>
        <%= arr[i] %>
    <% } %>
</div>